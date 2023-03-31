import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";
import { sendMail } from "./helpers/mail";
import { getAuth } from "firebase-admin/auth";

exports.createNotificationOnContributionCreate = functions
  .region("europe-west1")
  .firestore.document("species/{speciesId}/contributions/{subcollectionId}")
  .onCreate(async (snap, context) => {
    // Create a record in the notifications collection
    // const notification = {
    //   createdAt: new Date(),
    //   speciesId: context.params.speciesId,
    //   type: "contribution",
    //   read: false,
    // };
    // await getFirestore().collection("notifications").add(notification);

    await contributionMail(snap.data());
    return null;

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

const contributionMail = async (contributionData: any): Promise<any> => {
  const contributorRef = await contributionData.user.get();
  const contributorUid = contributorRef.id;
  const contributorData = await getAuth().getUser(contributorUid);

  const speciesData = await contributionData.species.get();

  // Send email to admin
  const userList = await getAuth().listUsers();
  // Get users with admin role
  const adminUsers = userList.users.filter(
    (user) => user.customClaims?.isAdmin === true
  );
  // Get email addresses
  const adminEmails = adminUsers.map((user) => user.email);

  const adminHtmlContent = `
  <html>
    <head>
      <style>
      table, th, td {
        border: 1px solid black;
        border-collapse: collapse;
      }
      </style>
    </head>
    <body>
      <table>
        <tbody>
          <tr>
            <td>Espèce</td>
            <td>${speciesData.data().scientific_name}<br/>${
    speciesData.data().common_names.fr[0]
  }</td>
          </tr>
          <tr>
            <td>Utilisateur</td>
            <td>${contributorUid}<br/>${contributorData.email}</td>
          </tr>
          <tr>
            <td>Date</td>
            <td>${contributionData.timestamp
              .toDate()
              .toLocaleString("fr-FR")}</td>
          </tr>
          <tr>
            <td>Champ</td>
            <td>${contributionData.field}</td>
          </tr>
          <tr>
            <td>Nouvelle valeur</td>
            <td>${contributionData.newValue}</td>
          </tr>
          <tr>
            <td>Commentaire</td>
            <td>${contributionData.comment}</td>
          </tr>
          <tr>
            <td>Statut</td>
            <td>${contributionData.status}</td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `;
  await sendMail(
    adminEmails,
    "SeaLife - Nouvelle contribution de " + contributorData.email,
    adminHtmlContent
  );
};
