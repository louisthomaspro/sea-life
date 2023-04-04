import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../firebase/adminApp";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { token } = req.body;

  try {
    await firebaseAdmin.auth().verifyIdToken(token);
    res.status(200).json({ message: "Valid token" });
  } catch (err: any) {
    res.status(401).json({ message: "Invalid token", errorCode: err.code });
  }
};

export default handler;
