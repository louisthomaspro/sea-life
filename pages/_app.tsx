import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/commons/Layout";
import { AuthContextProvider } from "../context/auth.context";
import Head from "next/head";
import { ToastContainer, toast, Slide } from "react-toastify";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <title>Sea Guide</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </Head>
      <AuthContextProvider>
        <ToastContainer
          position={toast.POSITION.BOTTOM_CENTER}
          transition={Slide}
          hideProgressBar={true}
        />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthContextProvider>
    </>
  );
}

export default MyApp;
