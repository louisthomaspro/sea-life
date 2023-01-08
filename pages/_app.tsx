import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/commons/Layout";
import { AuthContextProvider } from "../context/auth.context";
import Head from "next/head";
import { ToastContainer, toast, Slide } from "react-toastify";
import { HistoryContextProvider } from "../context/history.context";
import { RegionContextProvider } from "../context/region.context";
import { Analytics } from "@vercel/analytics/react";
import { useScrollRestoration } from "../utils/saveScrollPos";
import { Nunito } from "@next/font/google";
const nunito = Nunito({ subsets: ["latin"] });

function MyApp({ Component, pageProps, router }: AppProps) {
  useScrollRestoration();

  return (
    <>
      <style jsx global>{`
        :root {
          font-family: ${nunito.style.fontFamily};
        }
      `}</style>
      <Head>
        <title>Sea Life</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className={nunito.className}>
        <RegionContextProvider>
          {/* <AuthContextProvider> */}
            <HistoryContextProvider>
              {/* <ToastContainer
                position={toast.POSITION.BOTTOM_CENTER}
                transition={Slide}
                hideProgressBar={true}
              /> */}
              <Layout>
                <Component {...pageProps} />
                {/* <Analytics /> */}
              </Layout>
            </HistoryContextProvider>
          {/* </AuthContextProvider> */}
        </RegionContextProvider>
      </div>
    </>
  );
}

export default MyApp;
