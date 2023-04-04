import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import {
  getGroupPaths,
  getParentGroupPaths,
  onDemandRevalidation,
} from "./helpers/revalidation";
import { regionsList } from "./constants/regions";
import { revalidationSecret } from "./helpers/env";

const db = getFirestore();

/**
 * On group create/update, update the group count for the group and revalidate the group page
 * On group delete, revalidate the parent group page
 */
exports.updateGroupCountOnGroupWrite = functions
  .region("europe-west1")
  .runWith({ secrets: [revalidationSecret] })
  .firestore.document("group/{id}")
  .onWrite(async (change, context) => {
    if (change.after.exists) {
      // Group created or updated
      functions.logger.info("Updating group count for:", context.params.id);
      await updateCount(context.params.id, revalidationSecret.value());
      return null;
    } else {
      // Group deleted
      await onDemandRevalidation(
        getParentGroupPaths(change.after.data()),
        revalidationSecret.value()
      );
      return null;
    }
  });

/**
 * If species is_deleted field or taxonomy is updated or species is created or deleted,
 * update the count for the groups that the species belongs to
 **/
exports.updateGroupCountOnSpeciesDeleteOrRestore = functions
  .region("europe-west1")
  .runWith({ secrets: [revalidationSecret] })
  .firestore.document("species/{id}")
  .onWrite(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check if species is soft deleted or hard deleted or restored or created
    let speciesStatus = "UNKNOWN";
    if (before?.is_deleted && !after?.is_deleted) {
      speciesStatus = "RESTORED";
    } else if (!before?.is_deleted && after?.is_deleted) {
      speciesStatus = "SOFT_DELETED";
    } else if (!before && after) {
      speciesStatus = "CREATED";
    } else if (before && !after) {
      speciesStatus = "HARD_DELETED";
    } // taxonomy field updated
    else if (before?.taxonomy_ids == null) {
      speciesStatus = "POPULATED";
    } else {
      speciesStatus = "UPDATED";
    }

    if (
      speciesStatus === "UNKNOWN" ||
      speciesStatus === "CREATED" ||
      speciesStatus === "UPDATED"
    ) {
      return null;
    }

    functions.logger.info(
      `Species ${speciesStatus}, updating species count + revalidating group pages`,
      context.params.id
    );

    // Get all groups that the species belongs to
    const groups = await db
      .collection("/group")
      .where(
        "includes",
        "array-contains-any",
        after?.taxonomy_ids || before?.taxonomy_ids
      )
      .get();

    const groupsIds = groups.docs.map((doc) => doc.id);

    functions.logger.info(
      "Updating species count for the following groups",
      groupsIds
    );

    const promises = groupsIds.map((groupId) =>
      updateCount(groupId, revalidationSecret.value())
    );
    await Promise.all(promises);
    await onDemandRevalidation(["/explore"], revalidationSecret.value());
    return null;
  });

/**
 * Update count for a group and revalidate the group pages
 * If group exists, update the species count for each regions (all, red-sea, etc.)
 * Revalidate pages where the group appears
 **/
async function updateCount(
  id: string,
  revalidationSecret: string
): Promise<any> {
  const group = await db.collection("/group").doc(id).get();

  if (!group.exists) {
    functions.logger.info(`Group ${id} does not exist`);
    return Promise.resolve();
  }

  const allChildSpecies = await db
    .collection("/species")
    .where("taxonomy_ids", "array-contains-any", group.data().includes)
    .where("is_deleted", "==", false)
    .get();

  let currentSpeciesCount: {
    [region: string]: number;
  } = group.data()?.species_count || {};
  currentSpeciesCount["all"] = allChildSpecies.size;

  // For each region
  for (const region of regionsList) {
    if (region === "all") continue;

    const regionCount = allChildSpecies.docs.filter((doc) =>
      (doc.data().regions || []).includes(region)
    ).length;

    currentSpeciesCount[region] = regionCount;
  }

  // Update species count
  await group.ref.update({
    species_count: currentSpeciesCount,
  });

  functions.logger.info(`Count updated for group ${id}`, currentSpeciesCount);

  // Revalidate pages where the group appears
  const paths = [
    ...getGroupPaths(group.data()),
    ...getParentGroupPaths(group.data()),
  ];

  await onDemandRevalidation(paths, revalidationSecret);

  return Promise.resolve();
}
