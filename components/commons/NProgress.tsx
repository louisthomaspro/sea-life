import { useRouter } from "next/router";
import nProgress from "nprogress";
nProgress.configure({ showSpinner: false });
import { useEffect } from "react";

export default function NProgress(): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const handleRouteStart = () => nProgress.start();
    const handleRouteDone = () => nProgress.done();

    router.events.on("routeChangeStart", handleRouteStart);
    router.events.on("routeChangeComplete", handleRouteDone);
    router.events.on("routeChangeError", handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      router.events.off("routeChangeStart", handleRouteStart);
      router.events.off("routeChangeComplete", handleRouteDone);
      router.events.off("routeChangeError", handleRouteDone);
    };
  }, [router.events, router.pathname]);

  return undefined;
}
