import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../iron-session/withSession";

const handler = (req: NextApiRequest, res: NextApiResponse<any>) => {
  res.json({
    ...req.session.user,
  });
};

export default withSessionRoute(handler);
