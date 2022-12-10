import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebase } from "./clientApp";

export const auth = getAuth(firebase);
export const signInWithGoogle = () =>
  signInWithPopup(auth, new GoogleAuthProvider());
export const logOut = () => signOut(auth);
