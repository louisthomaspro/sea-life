import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
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
) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>;

export const withAuthServerSideProps =
  (fn: ServerSidePropsFn) => async (context: GetServerSidePropsContext) => {
    const cookies = nookies.get(context);
    // console.log("cookies", cookies)
    if (!cookies.token) {
      console.error("No token in cookies");
      return await fn(context, null);
    }

    let decodedToken;

    try {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(cookies.token);
    } catch (err: any) {
      console.error("withAuthServerSideProps :", err.code);
    }

    // console.log("decodedToken", decodedToken);
    // console.log(cookies.token);

    return await fn(context, decodedToken);
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
    const token =
      cookies["token"] || req.headers.authorization?.replace("Bearer ", "");

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
