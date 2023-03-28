import { useEffect } from "react";
import { auth } from "../../firebase/clientApp";
import nookies from "nookies";
import { useIdToken } from "react-firebase-hooks/auth";

export default function GoogleAuthListener() {
  const [user, loading, error] = useIdToken(auth);

  useEffect(() => {
    return auth.onIdTokenChanged(async (user) => {
      console.log("onIdTokenChanged", user);
      if (!user) {
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const token = await user.getIdToken();
        nookies.set(undefined, "token", token, { path: "/" });
      }
    });
  }, []);

  useEffect(() => {
    const handle = setInterval(async () => {
      console.log("Refreshing token...");
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  // useEffect(() => {
  //   console.log("error", error);
  // }, [error]);

  // useEffect(() => {
  //   console.log("loading", loading);
  // }, [loading]);

  return <></>;
}
