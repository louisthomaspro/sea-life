import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../firebase/adminApp";

export function withAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>, options?: { admin?: boolean }) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      // Check if claim admin is true
      if (options?.admin && !decodedToken.admin) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      return handler(req, res);
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}