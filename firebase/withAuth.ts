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
) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>;

export const withAuthServerSideProps =
  (fn: ServerSidePropsFn) => async (context: GetServerSidePropsContext) => {
    try {
      const cookies = nookies.get(context);
      // console.log("cookies", cookies)
      if (!cookies.token) {
        throw new Error("No token in cookies");
      }

      let decodedToken;

      try {
        decodedToken = await firebaseAdmin.auth().verifyIdToken(cookies.token);
      } catch (err: any) {
        if (err.code === "auth/id-token-expired") {
          // decodedToken = await firebaseAdmin.auth();
          // If expired, user will be redirected to /refresh page, which will force a client-side
          // token refresh, and then redirect user back to the desired page
          const encodedPath = encodeURIComponent(context.req.url);
          context.res.writeHead(302, {
            // Note that encoding avoids URI problems, and `req.url` will also
            // keep any query params intact
            Location: `/refresh?redirect=${encodedPath}`,
          });
          context.res.end();
        } else {
          // Other authorization errors...
        }
      }

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
    const token =
      cookies["your_cookie_name"] ||
      req.headers.authorization?.replace("Bearer ", "");

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
