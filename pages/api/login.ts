import { firebaseAdmin } from "../../firebase/adminApp";
import { withSessionRoute } from "../../iron-session/withSession";
import { IUser } from "../../types/User";

export default withSessionRoute(async function loginRoute(req, res) {
  const { idToken } = await req.body;

  let decodedToken = null;
  try {
    // Verify the ID token and get the user information
    decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
  const { uid, email, admin } = decodedToken;

  try {
    const user = {
      email,
      uid,
      isLoggedIn: true,
      isAdmin: admin,
    } as IUser;
    req.session.user = user;
    await req.session.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});
