import "../styles/globals.scss";
import type { AppProps } from "next/app";
import Layout from "../components/layouts/Layout";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";
import { useScrollRestoration } from "../utils/saveScrollPos";
import { Nunito } from "next/font/google";
import { RegionProvider } from "../components/region/region.context";
import { AuthProvider } from "../utils/auth/AuthProvider";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";
const nunito = Nunito({ subsets: ["latin"], display: "swap" });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useScrollRestoration();
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <style jsx global>{`
        :root {
          font-family: ${nunito.style.fontFamily};
          --font-family: ${nunito.style.fontFamily};
          --toastify-font-family: ${nunito.style.fontFamily};
        }
      `}</style>
      <Head>
        <title>SeaLife</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </Head>
      <div className={nunito.className}>
        <AuthProvider>
          <RegionProvider>
            <Layout>
              {getLayout(<Component {...pageProps} />)}
              <Analytics />
            </Layout>
          </RegionProvider>
        </AuthProvider>
      </div>
    </>
  );
}
