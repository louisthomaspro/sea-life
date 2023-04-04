import * as functions from "firebase-functions";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { host, iucnToken, revalidationSecret } from "./helpers/env";
// import { getStorage } from "firebase-admin/storage";

if (getApps().length === 0) {
  initializeApp();
}

// const speciesPhotos = require('./speciesPhotos');
// exports.speciesPhotos = speciesPhotos;

// const blurhashGeneration = require("./blurhashGeneration");
// exports.blurhashGeneration = blurhashGeneration;

// const mail = require("./mail");
// exports.mail = mail;

const species = require("./species");
exports.species = species;

const group = require("./group");
exports.group = group;

const contributions = require("./contributions");
exports.contributions = contributions;

const db = getFirestore();

// Export all species collection to json
exports.exportAllSpeciesToJson = functions
  .region("europe-west1")
  .https.onRequest((req, res) => {
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
  .https.onRequest(async (req, res) => {
    res.json("pong");
  });

// Env test
exports.env = functions
  .region("europe-west1")
  .runWith({ secrets: [revalidationSecret, iucnToken] })
  .https.onRequest((req, res) => {
    res.json({
      host: host.value(),
      revalidationSecret: revalidationSecret.value(),
      iucnToken: iucnToken.value(),
    });
  });

///////////////////////////////
