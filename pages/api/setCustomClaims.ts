import "firebase/auth";
import "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/adminApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { email, claims } = req.body;

  try {
    // Get the user with the specified email
    const user = await firebaseAdmin.auth().getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set the custom claim for the admin role
    await firebaseAdmin.auth().setCustomUserClaims(user.uid, claims);

    return res.status(200).json({ message: "Admin role set successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
}
