import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../../types/User";
import { withAuthApiRequest } from "../../../firebase/withAuth";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse,
  decodedToken: any
) => {
  res.status(200).json({ decodedToken });
};

export default withAuthApiRequest(handler);
