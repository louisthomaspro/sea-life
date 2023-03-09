import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../firebase/adminApp";
import { withSessionRoute } from "../../../iron-session/withSession";
import { IUser } from "../../../types/User";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { idToken } = await req.body;

  let decodedToken = null;
  try {
    // Verify the ID token and get the user information
    decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
  const { uid, email, admin } = decodedToken;
  const user = {
    email,
    uid,
    isLoggedIn: true,
    isAdmin: admin,
  } as IUser;

  try {
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export default withSessionRoute(handler);
