import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/commons/Layout";
import Head from "next/head";
import { ToastContainer, toast, Slide } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { useScrollRestoration } from "../utils/saveScrollPos";
import { Nunito } from "next/font/google";
import { RegionContextProvider } from "../components/region/region.context";
import dynamic from "next/dynamic";
const nunito = Nunito({ subsets: ["latin"], display: "swap" });

const DynamicGoogleAuthListener = dynamic(
  () => import("../components/commons/GoogleAuthListener")
);

function MyApp({ Component, pageProps, router }: AppProps) {
  useScrollRestoration();

  return (
    <>
      <style jsx global>{`
        :root {
          font-family: ${nunito.style.fontFamily};
          --font-family: ${nunito.style.fontFamily};
          --toastify-font-family: ${nunito.style.fontFamily};
        }
        .p-inputtext {
          font-family: var(--font-family);
        }
      `}</style>
      <Head>
        <title>SeaLife</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </Head>
      <DynamicGoogleAuthListener />
      <div className={nunito.className}>
        <RegionContextProvider>
          {/* <HistoryContextProvider> */}
          <ToastContainer
            position={toast.POSITION.BOTTOM_CENTER}
            transition={Slide}
            hideProgressBar={false}
          />
          <Layout>
            <Component {...pageProps} />
            {/* <Analytics /> */}
          </Layout>
          {/* </HistoryContextProvider> */}
        </RegionContextProvider>
      </div>
    </>
  );
}

export default MyApp;
