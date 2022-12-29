import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";

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
 * If species is deleted, update the species count for the group
 **/
// exports.updateCountOnSpeciesDelete = functions
//   .region("europe-west1")
//   .firestore.document("species/{id}")
//   .onDelete(async (snap, context) => {
//     const taxonomyIds = snap.data().taxonomy_ids;

//     functions.logger.info(
//       "Updating species count for the following groups",
//       taxonomyIds
//     );

//     const promises: Promise<any>[] = [];
//     for (const taxonomyId of taxonomyIds) {
//       promises.push(updateCount(taxonomyId));
//     }
//     return Promise.all(promises);
//   });

/**
 * If species is deleted, update the species count for the group
 **/
// exports.updateCountOnSpeciesCreate = functions
//   .region("europe-west1")
//   .firestore.document("species/{id}")
//   .onCreate(async (snap, context) => {
//     const taxonomyIds = snap.data().taxonomy_ids;

//     functions.logger.info(
//       "Updating species count for the following groups",
//       taxonomyIds
//     );

//     const promises: Promise<any>[] = [];
//     for (const taxonomyId of taxonomyIds) {
//       promises.push(updateCount(taxonomyId));
//     }
//     return Promise.all(promises);
//   });

/**
 * Update count for a group
 **/
async function updateCount(taxonomyId: string) {
  const group = await db.collection("/group").doc(taxonomyId).get();

  if (group.exists) {
    const allChildSpecies = await db
      .collection("/species")
      .where("taxonomy_ids", "array-contains", taxonomyId)
      .get();

    const allCount = allChildSpecies.size;
    const mediterraneanSeaCount = allChildSpecies.docs.filter((doc) =>
      doc.data().regions.includes("mediterranean-sea")
    ).length;

    let currentSpeciesCount = group.data()?.species_count || {};
    currentSpeciesCount["mediterranean-sea"] = mediterraneanSeaCount;
    currentSpeciesCount["all"] = allCount;

    return group.ref.update({
      species_count: currentSpeciesCount,
    });
  } else {
    functions.logger.info(`Group ${taxonomyId} does not exist, skipping`);
    return null;
  }
}
