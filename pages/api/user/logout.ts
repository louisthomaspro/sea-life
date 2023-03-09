import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../iron-session/withSession";
import { IUser } from "../../../types/User";

const handler = (req: NextApiRequest, res: NextApiResponse<IUser>) => {
  req.session.destroy();
  res.json({ isLoggedIn: false });
};

export default withSessionRoute(handler);
