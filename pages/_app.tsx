import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/commons/Layout";
import { AuthContextProvider } from "../context/auth.context";
import Head from "next/head";
import { ToastContainer, toast, Slide } from "react-toastify";
import { HistoryContextProvider } from "../context/history.context";
import { getAllSpecies } from "../utils/firestore/species.firestore";
import { RegionContextProvider } from "../context/region.context";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <title>Sea Life</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </Head>
      <RegionContextProvider>
        <AuthContextProvider>
          <HistoryContextProvider>
            <ToastContainer
              position={toast.POSITION.BOTTOM_CENTER}
              transition={Slide}
              hideProgressBar={true}
            />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </HistoryContextProvider>
        </AuthContextProvider>
      </RegionContextProvider>
    </>
  );
}

export default MyApp;
