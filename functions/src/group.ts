import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

/**
 * On species update, if photos ids changed, sync photos
 */
exports.syncPhotosOnUpdate = functions
  .region("europe-west1")
  .firestore.document("group/{id}")
  .onWrite(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    const newPhotos: string[] = newValue.photos.map((p: any) => p.id);
    const previousPhotos: string[] = previousValue.photos.map((p: any) => p.id);

  });