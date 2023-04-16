import { createContext, useContext, useEffect, useState } from "react";
import nookies from "nookies";
import { IUser } from "../../types/User";
import { Auth } from "firebase/auth";

const AuthContext = createContext<{ user: IUser | null; loading: boolean }>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen to the Firebase auth state and set the local state.
  const onIdTokenChanged = async (auth: Auth) => {
    return auth.onIdTokenChanged(async (firebaseUser) => {
      setLoading(true);
      if (!firebaseUser) {
        setUser(null);
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const idTokenResult = await firebaseUser.getIdTokenResult();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          token: idTokenResult.token,
          isAdmin: idTokenResult.claims.isAdmin || false,
        });
        nookies.set(undefined, "token", idTokenResult.token, {
          path: "/",
        });
      }
      setLoading(false);
    });
  };

  // Refresh the token every 10 minutes to avoid token expiration.
  const refreshUserToken = async (auth: Auth) => {
    const handle = setInterval(async () => {
      const user = auth.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(handle);
  };

  useEffect(() => {
    let unsubscribe: any;
    import("../../firebase/clientApp")
      .then((firebase) => firebase.auth)
      .then((auth) => {
        // Listen for changes in auth state and set the local state.
        let unsubscribeRefreshUserToken = refreshUserToken(auth);
        let unsubscribeOnIdTokenChanged = onIdTokenChanged(auth);
        unsubscribe = () => {
          unsubscribeRefreshUserToken;
          unsubscribeOnIdTokenChanged;
        };
      });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
