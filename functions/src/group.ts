import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import {
  getGroupPaths,
  getParentGroupPaths,
  onDemandRevalidation,
} from "./helpers/revalidation";
import { regionsList } from "./constants/regions";
import { revalidationSecret } from ".";
// import { regionsDict } from "../../constants/regions";

const db = getFirestore();

/**
 * On group create/update, update the group count for the group
 */
exports.updateGroupCountOnGroupWrite = functions
  .region("europe-west1")
  .runWith({ secrets: [revalidationSecret] })
  .firestore.document("group/{id}")
  .onWrite(async (change, context) => {
    if (change.after.exists) {
      functions.logger.info("Updating group count for", context.params.id);
      await updateCount(context.params.id, revalidationSecret.value());
      return null;
    } else {
      await onDemandRevalidation(
        getParentGroupPaths(change.after.data()),
        revalidationSecret.value()
      );
      return null;
    }
  });

/**
 * If species is_deleted field is updated,
 * update the count for the groups that the species belongs to
 **/
exports.updateGroupCountOnSpeciesDeleteOrRestore = functions
  .region("europe-west1")
  .runWith({ secrets: [revalidationSecret] })
  .firestore.document("species/{id}")
  .onWrite(async (snap, context) => {
    const before = snap.before.data();
    const after = snap.after.data();

    if (before.is_deleted === after.is_deleted) {
      return null;
    }

    if (before.is_deleted && !after.is_deleted) {
      functions.logger.info(
        "Species restored, updating species count + revalidating",
        context.params.id
      );
    }

    if (!before.is_deleted && after.is_deleted) {
      functions.logger.info(
        "Species deleted, updating species count + revalidating",
        context.params.id
      );
    }

    // Get all groups that the species belongs to
    const groups = await db
      .collection("/group")
      .where("includes", "array-contains-any", after.taxonomy_ids)
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
    return null;
  });

/**
 * Update count for a group
 * If group exists, update the species count for each regions (all, red-sea, etc.)
 * Revalidate pages where the group appears
 **/
async function updateCount(
  id: string,
  revalidationSecret: string
): Promise<any> {
  const group = await db.collection("/group").doc(id).get();

  if (group.exists) {
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
        doc.data().regions.includes(region)
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
  } else {
    // Group does not exist
    return Promise.resolve();
  }
}
