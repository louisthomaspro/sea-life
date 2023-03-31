import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";

const db = getFirestore();

export const sendMail = (to: string[], subject: string, html: string) => {
  return db.collection("mail").add({
    to,
    message: {
      subject,
      html,
    },
  });
};