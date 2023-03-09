import { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdmin } from "../firebase/adminApp";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../firebase/clientApp";

export function withAuthApi(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  options?: { admin?: boolean }
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      // const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      // // Check if claim admin is true
      // if (options?.admin && !decodedToken.admin) {
      //   return res.status(401).json({ error: "Unauthorized" });
      // }
      return handler(req, res);
    } catch (err) {
      console.error(err);
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}

export function withAuthClient(Component: any, options?: { admin?: boolean }) {
  return async function WithAuth(props: any) {
    useEffect(() => {
      try {
        onAuthStateChanged(auth, async (userSession) => {
          if (userSession) {
            const decodedToken = await userSession.getIdTokenResult();
            if (options?.admin && !decodedToken.claims.admin) {
              throw new Error("You are not authorized to access this page");
            }
          } else {
            throw new Error("You are not authorized to access this page");
          }
        });
      } catch (err) {
        console.log(err);
      }
    }, []);
    return <Component {...props} />;
  };
}

export function withAuth(Component: any) {
  return function WithAuth(props: any) {
    const router = useRouter();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (userSession) => {
        if (!userSession) {
          console.log("not logged in");
        }
      });

      return unsubscribe;
    }, []);

    return <Component {...props} />;
  };
}


// export const getServerSideProps = withAuthServerSideProps(async (ctx, user) => {
//   // Example 1 - Not found
//   const res = await fetch(`https://...`)
//   const data = await res.json()

//   if (!data) {
//     return {
//       notFound: true,
//     }
//   }

//   return { props: { data } }

//   // Example 2 - Redirect
//   const res = await fetch(`https://.../data`)
//   const data = await res.json()

//   if (!data) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false,
//       },
//     }
//   }

//   return { props: { data } }
// });