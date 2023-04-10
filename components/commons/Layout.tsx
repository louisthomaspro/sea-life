import { LazyMotion } from "framer-motion";
import { ReactNode, useState } from "react";
import NProgress from "./NProgress";
import OfflineToast from "./OfflineToast";
import WebHeader from "./WebHeader";
import styled from "styled-components";
const loadFeatures = () =>
  import("../../utils/feature.js").then((res) => res.default);

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  return (
    <>
      {!isProduction && (
        <EnvironmentBanner>
          <div className="text-xs p-1">NEXT_PUBLIC_VERCEL_ENV:  <span className="font-semibold">{process.env.NEXT_PUBLIC_VERCEL_ENV}</span></div>
        </EnvironmentBanner>
      )}
      <main className="sm:py-0">
        <NProgress />
        <OfflineToast />
        <LazyMotion features={loadFeatures}>
          <WebHeader className="hidden sm:block" />
          {children}
        </LazyMotion>
      </main>
    </>
  );
}

const EnvironmentBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
`
