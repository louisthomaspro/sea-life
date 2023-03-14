import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

exports.onContributionCreate = functions.firestore
  .document("species/{speciesId}/contributions/{subcollectionId}")
  .onCreate(async (snap, context) => {

    // Create a record in the notifications collection
    const notification = {
      createdAt: new Date(),
      speciesId: context.params.speciesId,
      type: "contribution",
      read: false,
    };
    await getFirestore()
      .collection("notifications")
      .add(notification);

    // const userSnapshot = await getFirestore()
    //   .collection("users")
    //   .doc('7TLEJuE79cY5DW0UhtRpLzjEjse2')
    //   .get();
    // const fcmToken = userSnapshot.data().fcmToken;

    // const message = {
    //   notification: {
    //     title: "New contribution",
    //     body: "A new contribution has been created for a species.",
    //   },
    //   token: fcmToken,
    //   data: {
    //     subcollectionId: snap.id,
    //     speciesId: context.params.speciesId,
    //   },
    // };
    // await getMessaging().send(message);
  });
