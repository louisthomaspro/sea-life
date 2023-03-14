import { User } from "firebase/auth";

export interface IUser {
  email?: string;
  uid? : string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  favorites?: string[];
}

export interface FirebaseUser extends User {
  accessToken: string;
}
