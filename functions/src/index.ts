import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

initializeApp();

const speciesPhotos = require('./speciesPhotos');
exports.speciesPhotos = speciesPhotos;

const group = require('./group');
exports.group = group;

const db = getFirestore();

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

  // Ping
exports.ping = functions
.region("europe-west1")
.https.onRequest((req, res) => {
  res.json('pong')
});

///////////////////////////////


