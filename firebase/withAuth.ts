import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next";
import nookies, { parseCookies } from "nookies";
import { firebaseAdmin } from "./adminApp";

type ServerSidePropsFn<
P extends { [key: string]: unknown } = { [key: string]: unknown }
> = (
  context: GetServerSidePropsContext,
  decodedToken: any
) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>

export const withAuthServerSideProps =
  (fn: ServerSidePropsFn) => async (context: GetServerSidePropsContext) => {
    try {
      const cookies = nookies.get(context);
      // console.log("cookies", cookies)
      if (!cookies.token) {
        throw new Error("No token in cookies");
      }
      const decodedToken = await firebaseAdmin
        .auth()
        .verifyIdToken(cookies.token);

      // console.log("decodedToken", decodedToken);
      // console.log(cookies.token);

      return await fn(context, decodedToken);
    } catch (err) {
      console.log("err", err);
      return await fn(context, null);
    }
  };

type Middleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  decodedToken: any
) => void;

export const withAuthApiRequest =
  (handler: Middleware) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const cookies = parseCookies({ req });
    const token = cookies['your_cookie_name'] || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).end("Not authenticated. No Auth header");
    }

    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      if (!decodedToken || !decodedToken.uid) {
        return res.status(401).end("Token invalid");
      }
      // console.log("decodedToken", decodedToken);

      return handler(req, res, decodedToken);
    } catch (err) {
      console.log("err", err);
      return res.status(401).end("Token invalid");
    }
  };