import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import axios from "axios";

const getRandomValues = require("get-random-values");
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

initializeApp();
const db = getFirestore();
const bucket = getStorage().bucket();

/**
 * Update parent with the new id
 * 1. Push id to child_ids* of parent
 */
exports.addIdToParent = functions
  .region("europe-west1")
  .firestore.document("lives/{id}")
  .onCreate(async (snap, context) => {
    // #1
    const parentId = snap.data().parent_id;
    const parentSnap = await db.doc(`lives/${parentId}`).get();
    await parentSnap.ref.update({
      child_ids: FieldValue.arrayUnion(snap.data().id),
    });
    functions.logger.info(
      `[${context.params.id}] - Id pushed to child_ids of parent (${parentSnap.id})`
    );
  });

/**
 * Delete life and his children (including photos)
 * 1. Delete child_id from parent
 * 2. Delete life images
 * 3. Delete children
 */
exports.cascadeDeletion = functions
  .region("europe-west1")
  .firestore.document("lives/{id}")
  .onDelete(async (snap, context) => {
    // #1
    const parentId = snap.data().parent_id;
    const parentSnap = await db.doc(`lives/${parentId}`).get();
    if (parentSnap.exists) {
      // Parent does not exists when deletion is called from #2
      await parentSnap.ref.update({
        child_ids: FieldValue.arrayRemove(snap.data().id),
      });
      functions.logger.info(
        `[${context.params.id}] - Id removed from child_ids of parent (${parentSnap.id})`
      );
    }

    // #2
    try {
      await deleteStorageFiles(`lives/${context.params.id}`);
      functions.logger.info(`[${context.params.id}] - Images deleted`);
    } catch (error) {
      functions.logger.error(
        `[${context.params.id}] - Error deleting images`,
        error
      );
    }

    // #3
    for (const childId of snap.data().child_ids) {
      await db.doc(`lives/${childId}`).delete();
      functions.logger.info(
        `[${context.params.id}] - Child deleted (${childId})`
      );
    }
  });

/**
 * Synchronize life photos
 */
exports.syncPhotosOnUpdate = functions
  .region("europe-west1")
  .firestore.document("lives/{id}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    const newPhotos: string[] = newValue.photos.map((p: any) => p.id);
    const previousPhotos: string[] = previousValue.photos.map((p: any) => p.id);

    if (!equals(newPhotos, previousPhotos) || newValue.updatePhotos) {
      return syncPhotos(change.after);
    }
  });

exports.syncPhotosOnCreate = functions
  .region("europe-west1")
  .firestore.document("lives/{id}")
  .onCreate(async (snap, context) => {
    await syncPhotos(snap);
  });

// Add ids to all photos
exports.updateAllPhotosIds = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    functions.logger.info(
      `Updating all documents from parent ${data.parent_id}`
    );
    return db
      .collection("/lives")
      .where("parent_ids", "array-contains", data.parent_id)
      .get()
      .then((snapshot) => {
        const promises: Promise<any>[] = [];
        snapshot.forEach((doc) => {
          let photos = doc.data().photos;
          for (const photo of photos) {
            photo.id = uuidv4();
            photo.storage_path = null;
          }
          promises.push(doc.ref.update({ photos, updatePhotos: true }));
        });
        return Promise.all(promises);
      });
  });

// Upload photos of lives
exports.syncAllPhotos = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    functions.logger.info(
      `Updating all documents from parent ${data.parent_id}`
    );
    return db
      .collection("/lives")
      .where("parent_ids", "array-contains", data.parent_id)
      .get()
      .then((snapshot) => {
        const promises: Promise<any>[] = [];
        snapshot.forEach((doc) => {
          promises.push(syncPhotos(doc));
        });
        return Promise.all(promises);
      });
  });


  // Add ids to all photos
exports.exportCsv = functions
.region("europe-west1")
.https.onRequest((req, res) => {
  functions.logger.info(
    `Export to json`
  );

  db
    .collection("/lives")
    .get()
    .then((snapshot) => {
      let data: any[] = []
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });
      res.json(data)
    });
});

///////////////////////////////

/**
 * Upload first image from life
 *
 * 1. Delete all files (prevent unused files)
 * 2. Upload all images and update storage_path property
 *
 * https://thinkdiff.net/how-to-upload-files-from-firebase-cloud-functions-to-firebase-cloud-storage-9d8b1a0f65e5
 *
 * @param snap
 * @returns
 */
const syncPhotos = async (
  lifeSnap: functions.firestore.QueryDocumentSnapshot
) => {
  const life = lifeSnap.data();

  functions.logger.info(`[${life.id}] - Sync photos started`);

  // #1
  try {
    await deleteStorageFiles(`lives/${life.id}`);
    functions.logger.info(`[${life.id}] - Images deleted`);
  } catch (error) {
    functions.logger.error(`[${life.id}] - Error deleting images`, error);
  }

  // #2
  await uploadLifePhotos(lifeSnap);
  functions.logger.info(`[${life.id}] - Photos uploaded`);

  functions.logger.info(`[${life.id}] - Sync photos finished`);

  return life.id;
};

const uuidv4 = (): string => {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    // tslint:disable-next-line:no-bitwise
    (c ^ (getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
};

const downloadRemoteUrlImage = async (remoteUrl: string, fileName: string) => {
  return axios({
    method: "get",
    url: remoteUrl,
    responseType: "stream",
  }).then((response) => {
    const extension = response.headers["content-type"].split("/")[1];
    const fileNameWithExt = `${fileName}.${extension}`;
    const tempFilePath = path.join(os.tmpdir(), fileNameWithExt);
    const writer = fs.createWriteStream(tempFilePath);

    // Wait for another promise to write the file completely into disk
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error: any = null;
      writer.on("error", (err: any) => {
        error = err;
        writer.close();
        throw new Error(err);
      });
      writer.on("close", () => {
        if (!error) {
          resolve({
            tempFilePath,
            fileNameWithExt,
          });
        }
      });
    });
  });
};

const uploadLocalFileToStorage = async (
  filePath: string,
  destination: string
) => {
  try {
    // Uploads a local file to the bucket
    await bucket.upload(filePath, {
      destination,
      metadata: {
        cacheControl: "public, max-age=31536000",
      },
    });

    functions.logger.info(`uploaded to /${destination}.`);
  } catch (e) {
    throw new Error("uploadLocalFileToStorage failed: " + e);
  }
};

/**
 * Upload all images from life.photos and update storage_path property
 * @param lifeSnap
 */
const uploadLifePhotos = async (
  lifeSnap: functions.firestore.QueryDocumentSnapshot
) => {
  const life = lifeSnap.data();
  const photos = life.photos;
  const bucketFolder = `lives/${life.id}`;

  for (const photo of photos) {
    const fileName = photo.id;

    try {
      // Step 1: Download mediaUrl to temporary directory
      const { tempFilePath, fileNameWithExt }: any =
        await downloadRemoteUrlImage(photo.original_url, fileName);
      functions.logger.info(`Download Complete: File Path: ${tempFilePath}`);

      // Step 2: Upload to Firestore Storage
      await uploadLocalFileToStorage(
        tempFilePath,
        `${bucketFolder}/${fileNameWithExt}`
      );

      // Step 3: Update storage_path property
      photo.storage_path = `${bucketFolder}/${photo.id}`;
    } catch (error) {
      functions.logger.error(
        `[${life.id}] - Error on downloading and uploading remote media file to storage: `,
        error
      );
    }
  }

  // Update document
  lifeSnap.ref.update({ photos, updatePhotos: FieldValue.delete() });
};

const deleteStorageFiles = async (directory: string) => {
  const files = await bucket
    .getFiles({
      directory,
    })
    .then((res) => res[0]);
  const promises: Promise<any>[] = [];
  files.forEach((f) => {
    promises.push(f.delete());
  });
  return Promise.all(promises);
};

const equals = (a: any[], b: any[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);
