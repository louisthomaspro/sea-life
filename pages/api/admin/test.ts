import { NextApiRequest, NextApiResponse } from "next";
import { withAuthApiRequest } from "../../../firebase/withAuth";

const handler = (
  req: NextApiRequest,
  res: NextApiResponse<any>,
  decodedToken: any
) => {
  // console.log("decodedToken", decodedToken)
  if (!decodedToken?.isAdmin) {
    return res.status(404).end();
  }

  res.json({
    decodedToken,
  });
};

export default withAuthApiRequest(handler);
