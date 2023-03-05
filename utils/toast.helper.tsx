import { GoogleSignIn } from "../components/commons/GoogleAuth";

export const SignInToast = ({ closeToast, toastProps, message }: any) => (
  <div className="flex align-items-center">
    <div>{message}</div>
    <GoogleSignIn />
  </div>
);
