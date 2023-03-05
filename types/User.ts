export interface IUser {
  email?: string;
  uid? : string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  favorites?: string[];
}
