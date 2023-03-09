import "firebase/auth";
import "firebase/firestore";
import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../firebase/adminApp";
import { withSessionRoute } from "../../../iron-session/withSession";

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

    // Fetch updated user object from Firebase
    const updatedUser = await firebaseAdmin.auth().getUser(uid);

    // // Update user object in session
    // req.session.user = updatedUser.toJSON();

    req.session.user = { ...req.session.user, isAdmin: claims.admin}
    req.session.save();

    // Update session data in cookie
    // await req.session.save();

    // Update the user in the database
    // await firebaseAdmin.firestore().collection("users").doc(user.uid).update({
    //   claims,
    // });

    // Revokes all refresh tokens for the user
    // await firebaseAdmin.auth().revokeRefreshTokens(user.uid);

    return res.status(200).json({ message: "New claim set successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred" });
  }
};

export default withSessionRoute(handler);
