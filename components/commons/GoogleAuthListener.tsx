import { useEffect } from "react";
import { auth } from "../../firebase/clientApp";
import nookies from "nookies";
import { useAuthState } from "react-firebase-hooks/auth";

export default function GoogleAuthListener() {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    // console.log("user", user);
    if (!user) {
      // logout
      nookies.set(undefined, "token", "", { path: "/" });
    } else {
      // login
      user.getIdToken().then((token) => {
        nookies.set(undefined, "token", token, { path: "/" });
      });
    }
  }, [user]);

  useEffect(() => {
    // console.log("error", error);
  }, [error]);

  useEffect(() => {
    // console.log("loading", loading);
  }, [loading]);

  return <></>;
}
