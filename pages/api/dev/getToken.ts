import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../../../firebase/adminApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ message: "Not Found" });
  }

  const { uid } = req.query as { uid: string };

  const customToken = await firebaseAdmin.auth().createCustomToken(uid);
  const result = await fetch(
    `http://localhost:9099/www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: "POST",
      mode: "cors",
      cache: "default",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: customToken,
        returnSecureToken: true,
      }),
    }
  );
  const json = await result.json();
  const idToken = json.idToken;

  res.status(200).send(idToken);
}
