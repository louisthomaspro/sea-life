import { useEffect } from "react";
import { auth } from "../firebase/clientApp";
import nookies from "nookies";
import { useRouter } from "next/router";
import Spinner from "../components/commons/Spinner";
import { useAuthState } from "react-firebase-hooks/auth";

const Refresh = () => {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/profile");
      return;
    };
    if(!router.isReady) return;
    
    try {
      user
        .getIdToken(true) // true will force token refresh
        .then(async (token) => {
          // Updates user cookie
          if (token) {
            nookies.set(undefined, "token", token, { path: "/" });
          } else {
            router.replace("/profile");
            return;
          }

          // Redirect back to where it was
          const decodedPath = window.decodeURIComponent(
            router.query.redirect as string
          );
          if (decodedPath) {
            router.replace(decodedPath);
            return;
          }
        })
        .catch(() => {
          // If any error happens on refresh, redirect to home
          router.replace("/");
          return;
        });
    } catch (error) {
      console.error(error);
      router.replace("/profile");
      return;
    }
  }, [user, router.isReady]);

  return (
    // Show a simple loading while refreshing token?
    <div className="flex my-4">
      <Spinner />
    </div>
  );
};

export default Refresh;
