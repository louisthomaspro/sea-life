import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/auth";
import { IUser } from "../types/User";
import { createUser, getUser } from "../utils/firestore/user.firestore";

interface IAuthContext {
  userSession: User;
  userData: IUser;
  setUserData: (...args: any) => any;
  loading: boolean;
}

const AuthContext = createContext({} as IAuthContext);

export function AuthContextProvider({ children }: any) {
  const [userSession, setUserSession] = useState<User>(null);
  const [userData, setUserData] = useState<IUser>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe;

    unsubscribe = onAuthStateChanged(auth, async (userSession) => {
      // Login
      if (userSession) {
        const userData = (await getUser(userSession.email)) as IUser;
        if (!userData) {
          const newUserData: IUser = {
            email: userSession.email,
          };

          // Create user in firestore
          await createUser(newUserData, userSession.email);

          // Set context data
          await setUserData(newUserData);
        } else {
          const token = await userSession.getIdTokenResult();
          await setUserData({ ...userData, admin: token.claims.admin });
        }
        setUserSession(userSession);
      } else {
        // Logout
        setUserData(null);
        setUserSession(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ userSession, userData, loading, setUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
