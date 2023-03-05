import { NextApiRequest, NextApiResponse } from "next";
import { IUser } from "../../types/User";
import { withSessionRoute } from "../../iron-session/withSession";

export default withSessionRoute(userRoute);

async function userRoute(req: NextApiRequest, res: NextApiResponse<IUser>) {
  if (req.session.user) {
    res.json({
      ...req.session.user,
      isLoggedIn: true,
    });
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
}
