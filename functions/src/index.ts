import * as functions from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
// import { getStorage } from "firebase-admin/storage";
const { defineString } = require("firebase-functions/params");

initializeApp();

export const host = defineString("HOST", {
  default: "http://localhost:3000",
  description: "Host of the frontend",
  input: {
    select: {
      options: [
        { value: "http://localhost:3000" },
        { value: "https://sea-life.vercel.app" },
      ],
    },
  },
});

export const revalidationSecret = defineSecret("REVALIDATION_SECRET");

// const speciesPhotos = require('./speciesPhotos');
// exports.speciesPhotos = speciesPhotos;

// const blurhashGeneration = require("./blurhashGeneration");
// exports.blurhashGeneration = blurhashGeneration;

const species = require("./species");
exports.species = species;

const group = require("./group");
exports.group = group;

const contributions = require("./contributions");
exports.contributions = contributions;

const mail = require("./mail");
exports.mail = mail;

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
exports.ping = functions.region("europe-west1").https.onRequest((req, res) => {
  res.json("pong");
});

// Env test
exports.env = functions
  .region("europe-west1")
  .runWith({ secrets: [revalidationSecret] })
  .https.onRequest((req, res) => {
    res.json({
      host: host.value(),
      revalidationSecret: revalidationSecret.value(),
    });
  });

///////////////////////////////
