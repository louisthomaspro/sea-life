import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, logOut, signInWithGoogle } from "../../firebase/clientApp";
import fetchJson from "../../iron-session/fetchJson";
import useUser from "../../iron-session/useUser";
import { IUser } from "../../types/User";
import Button from "./Button";

export function GoogleSignIn() {
  const [disabled, setDisabled] = useState(false);
  const { mutateUser } = useUser();

  useEffect(() => {
    let unsubscribe;

    unsubscribe = onAuthStateChanged(auth, async (userSession) => {
      if (!userSession) return;

      const body = {
        idToken: await userSession.getIdToken(),
      };

      try {
        mutateUser(
          await fetchJson("/api/login", {
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

  return (
    <GoogleButton
      onClick={() => {
        setDisabled(true);
        signInWithGoogle().finally(() => {
          setDisabled(false);
        });
      }}
      disabled={disabled}
    >
      Se connecter avec Google
    </GoogleButton>
  );
}

export function GoogleSignOut() {
  const { mutateUser } = useUser();

  useEffect(() => {
    let unsubscribe;

    unsubscribe = onAuthStateChanged(auth, async (userSession) => {
      if (userSession) return;
      try {
        mutateUser(
          await fetchJson("/api/logout", {
            method: "POST",
          }),
          false
        );
      } catch (error) {
        console.error("An unexpected error happened:", error);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Button $outline onClick={logOut}>
      Se déconnecter
    </Button>
  );
}

// Style
const GoogleButton = styled.button`
  transition: background-color 0.3s, box-shadow 0.3s;

  padding: 12px 16px 12px 42px;
  border: none;
  border-radius: 3px;
  box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);

  color: #757575;
  font-size: 14px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

  background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=);
  background-color: white;
  background-repeat: no-repeat;
  background-position: 12px center;

  &:hover {
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25);
  }

  &:active {
    background-color: #eeeeee;
  }

  &:focus {
    outline: none;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.25),
      0 0 0 3px #c8dafc;
  }

  &:disabled {
    filter: grayscale(100%);
    background-color: #ebebeb;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
`;
