import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../firebase/adminApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ message: "Not Found" });
  }

  const { uid, claims } = req.body;

  try {
    // Get the user with uid
    const user = await firebaseAdmin.auth().getUser(uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set the custom claim
    await firebaseAdmin.auth().setCustomUserClaims(user.uid, claims);

    // Fetch updated user object from Firebase
    // const updatedUser = await firebaseAdmin.auth().getUser(uid);

    // Update the user in the database
    // await firebaseAdmin.firestore().collection("users").doc(user.uid).update({
    //   claims,
    // });

    // Revokes all refresh tokens for the user
    await firebaseAdmin.auth().revokeRefreshTokens(user.uid);

    return res.status(200).json({ message: "New claim set successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
}