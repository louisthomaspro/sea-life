import * as firebaseAdmin from "firebase-admin";
import { cert } from "firebase-admin/app";

const adminCredentials = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
};

try {
  firebaseAdmin.initializeApp({
    credential: cert(adminCredentials),
  });
} catch (error: any) {
  if (!/already exists/u.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export { firebaseAdmin };
