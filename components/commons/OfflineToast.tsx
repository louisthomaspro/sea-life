import { useEffect } from "react";
import { toast } from "react-toastify";

export default function OfflineToast(): JSX.Element {
  const handleStatusChange = () => {
    if (navigator.onLine) {
      toast.dismiss("offline");
    } else {
      toast.warn("Vous êtes hors ligne", {
        toastId: "offline",
        autoClose: false,
      });
    }
  };

  useEffect(() => {
    // Listen to the network status
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  return undefined;
}
