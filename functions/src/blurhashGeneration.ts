import * as functions from "firebase-functions";
import { getPlaiceholder } from "plaiceholder";

// Generate blurhash on species update
exports.generateBlurhashForSpecies = functions
  .region("europe-west1")
  .firestore.document("species/{id}")
  .onWrite(async (change, context) => {
    if (!change.after.exists) {
      return null;
    }
    return updateBlurhash(change.after);
  });

// Generate blurhash on group update
exports.generateBlurhashForGroup = functions
  .region("europe-west1")
  .firestore.document("group/{id}")
  .onWrite(async (change, context) => {
    if (!change.after.exists) {
      return null;
    }
    return updateBlurhash(change.after);
  });


/////////////////////////////////////////////////////////////////

const updateBlurhash = async (
  snapshot: functions.firestore.DocumentSnapshot
) => {
  const newValue = snapshot.data();
  await Promise.all(
    newValue.photos.map(async (photo: any) => {
      const { blurhash } = await getPlaiceholder(photo.original_url, {
        size: 25,
      });
      photo.blurhash = blurhash;
    })
  );
  return snapshot.ref.set(newValue, { merge: true });
};
