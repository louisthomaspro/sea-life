import { useEffect } from "react";
import { auth, logOut } from "../../firebase/clientApp";
import nookies from "nookies";
import { useIdToken } from "react-firebase-hooks/auth";
import { connectStorageEmulator } from "firebase/storage";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function GoogleAuthListener() {
  const [user, loading, error] = useIdToken(auth);
  const router = useRouter();

  useEffect(() => {
    // Verify token with api
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const token = await user.getIdToken();
        nookies.set(undefined, "token", token, { path: "/" });

        user.getIdToken().then(async (token) => {
          const res = await fetch("/api/verifyToken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
          // check request status
          if (res.status !== 200) {
            console.error("error", data);
            logOut();
            toast.info("Votre session a expiré. Veuillez vous reconnecter.", {
              toastId: "session-expired",
            });
            router.push("/profile");
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    const handle = setInterval(async () => {
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
