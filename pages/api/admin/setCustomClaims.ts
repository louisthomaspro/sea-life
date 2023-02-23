import "firebase/auth";
import "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../firebase/adminApp";
import { withAuth } from "../../../hooks/withAuth";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { uid, claims } = req.body;

  try {
    // Get the user with uid
    const user = await firebaseAdmin.auth().getUser(uid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set the custom claim
    await firebaseAdmin.auth().setCustomUserClaims(user.uid, claims);

    // Update the user in the database
    await firebaseAdmin.firestore().collection("users").doc(user.uid).update({
      claims,
    });

    return res.status(200).json({ message: "New claim set successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

export default withAuth(handler);
export { handler as setCustomClaims };
