import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

initializeApp();

const speciesPhotos = require('./speciesPhotos');
exports.speciesPhotos = speciesPhotos;

const db = getFirestore();
const bucket = getStorage().bucket();

// Export species as CSV
exports.exportCsv = functions
  .region("europe-west1")
  .https.onRequest((req, res) => {
    functions.logger.info(`Export to json`);

    db.collection("/species")
      .get()
      .then((snapshot) => {
        let data: any[] = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
        res.json(data);
      });
  });

///////////////////////////////


