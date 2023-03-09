import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../iron-session/withSession";

const handler = (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (!req?.session?.user?.isAdmin) {
    return res.status(404).end();
  }

  res.json({
    ...req.session.user,
  });
};

export default withSessionRoute(handler);
