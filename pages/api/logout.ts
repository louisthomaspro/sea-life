import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../iron-session/withSession";
import { IUser } from "../../types/User";

export default withSessionRoute(logoutRoute);

function logoutRoute(req: NextApiRequest, res: NextApiResponse<IUser>) {
  req.session.destroy();
  res.json({ isLoggedIn: false });
}
