import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
// import { regionsDict } from "../../constants/regions";

const regionsList = [
  "all",
  "red-sea",
  "mediterranean-sea",
  "indian-ocean",
  "tropical-atlantic",
  "temperate-atlantic",
  "tropical-pacific",
];

const db = getFirestore();

/**
 * On group create/update, update the species count for the group
 */
exports.updateCountOnGroupCreate = functions
  .region("europe-west1")
  .firestore.document("group/{id}")
  .onWrite(async (change, context) => {
    if (!change.after.exists) {
      functions.logger.info(
        "Group deleted, skipping species count update",
        context.params.id
      );
      return null;
    }

    functions.logger.info(
      "Updating species count for group",
      context.params.id
    );

    return updateCount(context.params.id);
  });

/**
 * If species is_deleted field is updated, update the species count for the group
 **/
exports.updateCountOnSpeciesDeleteOrRestore = functions
  .region("europe-west1")
  .firestore.document("species/{id}")
  .onWrite(async (snap, context) => {
    const before = snap.before.data();
    const after = snap.after.data();

    if (before.is_deleted === after.is_deleted) {
      functions.logger.info(
        "Species is_deleted field not updated, skipping species count update",
        context.params.id
      );
      return null;
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

    const promises: Promise<any>[] = [];
    for (const groupId of groupsIds) {
      promises.push(updateCount(groupId));
    }
    return Promise.all(promises);
  });

/**
 * Update count for a group
 * If group exists, update the species count for each regions (all, red-sea, etc.)
 **/
async function updateCount(taxonomyId: string) {
  const group = await db.collection("/group").doc(taxonomyId).get();

  if (group.exists) {
    const allChildSpecies = await db
      .collection("/species")
      .where("taxonomy_ids", "array-contains-any", group.data().includes)
      .where("is_deleted", "==", false)
      .get();

    let currentSpeciesCount = group.data()?.species_count || {};
    currentSpeciesCount["all"] = allChildSpecies.size;

    // For each region
    for (const region of regionsList) {
      functions.logger.info(`Updating count for region ${region}`);

      if (region === "all") continue;

      const regionCount = allChildSpecies.docs.filter((doc) =>
        doc.data().regions.includes(region)
      ).length;

      currentSpeciesCount[region] = regionCount;
    }

    return group.ref.update({
      species_count: currentSpeciesCount,
    });
  } else {
    functions.logger.info(`Group ${taxonomyId} does not exist, skipping`);
    return null;
  }
}
