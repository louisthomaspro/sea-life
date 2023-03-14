import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, logOut, signInWithGoogle } from "../../firebase/clientApp";
import fetchJson from "../../iron-session/fetchJson";
import useUser from "../../iron-session/useUser";
import { IUser } from "../../types/User";
import Button from "./Button";
import nookies from "nookies";

export function GoogleSignIn() {
  const [disabled, setDisabled] = useState(false);
  const { mutateUser } = useUser();

  useEffect(() => {
    let unsubscribe;

    unsubscribe = onAuthStateChanged(auth, async (userSession) => {
      console.log("userSession", userSession);

      if (!userSession) {
        nookies.set(undefined, "token", "", { path: "/" });
      } else {
        const token = await userSession.getIdToken();
        nookies.set(undefined, "token", token, { path: "/" });
      }

      if (!userSession) return;

      const body = {
        idToken: await userSession.getIdToken(),
      };

      try {
        mutateUser(
          await fetchJson("/api/user/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }),
          false
        );

      } catch (error) {
        console.error("An unexpected error happened:", error);
      }
    });

    return unsubscribe;
  }, []);