import * as functions from "firebase-functions";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import axios from "axios";

const getRandomValues = require("get-random-values");
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

const db = getFirestore();
const bucket = getStorage().bucket();

/**
 * On species deletion, delete all photos
 */
exports.cascadeDeletion = functions
  .region("europe-west1")
  .firestore.document("species/{id}")
  .onDelete(async (snap, context) => {
    try {
      await deleteStorageFiles(`species/${context.params.id}`);
      functions.logger.info(`[${context.params.id}] - Images deleted`);
    } catch (error) {
      functions.logger.error(
        `[${context.params.id}] - Error deleting images`,
        error
      );
    }
  });

/**
 * On species update, if photos ids changed, sync photos
 */
exports.syncPhotosOnUpdate = functions
  .region("europe-west1")
  .firestore.document("species/{id}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    const newPhotos: string[] = newValue.photos.map((p: any) => p.id);
    const previousPhotos: string[] = previousValue.photos.map((p: any) => p.id);

    if (!equals(newPhotos, previousPhotos) || newValue.updatePhotos) {
      return syncPhotos(change.after);
    }
  });

/**
 * On species creation, sync photos
 */
exports.syncPhotosOnCreate = functions
  .region("europe-west1")
  .firestore.document("species/{id}")
  .onCreate(async (snap, context) => {
    await syncPhotos(snap);
  });

/**
 * Add ids to photos
 */
exports.updateAllPhotosIds = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    functions.logger.info(
      `Updating all documents from parent ${data.parent_id}`
    );
    return db
      .collection("/species")
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

/**
 * Upload photos of id
 */
exports.syncAllPhotos = functions
  .region("europe-west1")
  .https.onCall((data, context) => {
    functions.logger.info(
      `Updating all documents from parent ${data.parent_id}`
    );
    return db
      .collection("/species")
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

///////////////////////////////

/**
 * Upload first image from species
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
  speciesSnap: functions.firestore.QueryDocumentSnapshot
) => {
  const species = speciesSnap.data();
  functions.logger.info(`[${species.id}] - Sync photos started`);

  // #1
  try {
    await deleteStorageFiles(`species/${species.id}`);
    functions.logger.info(`[${species.id}] - Images deleted`);
  } catch (error) {
    functions.logger.error(`[${species.id}] - Error deleting images`, error);
  }

  // #2
  await uploadSpeciesPhotos(speciesSnap);
  functions.logger.info(`[${species.id}] - Photos uploaded`);

  functions.logger.info(`[${species.id}] - Sync photos finished`);

  return species.id;
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

/**
 * Uploads a local file to the bucket.
 * @param filePath
 * @param destination
 */
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
 * Upload all images from Species.photos and update storage_path property
 * @param speciesSnap
 */
const uploadSpeciesPhotos = async (
  speciesSnap: functions.firestore.QueryDocumentSnapshot
) => {
  const species = speciesSnap.data();
  const photos = species.photos;
  const bucketFolder = `species/${species.id}`;

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
        `[${species.id}] - Error on downloading and uploading remote media file to storage: `,
        error
      );
    }
  }

  // Update document
  speciesSnap.ref.update({ photos, updatePhotos: FieldValue.delete() });
};

/**
 * Delete the files in a directory
 * @param directory
 * @returns Promise
 */
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
