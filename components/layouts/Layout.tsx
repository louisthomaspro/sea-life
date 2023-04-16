import { LazyMotion } from "framer-motion";
import { ReactNode } from "react";
import NProgress from "../commons/NProgress";
import WebHeader from "../commons/WebHeader";
import { Slide, toast } from "react-toastify";
import dynamic from "next/dynamic";
const loadFeatures = () =>
  import("../../utils/feature.js").then((res) => res.default);

const DynamicToastContainer = dynamic(
  () => import("react-toastify").then((module) => module.ToastContainer),
  {
    ssr: false,
  }
);

const DynamicOfflineToast = dynamic(() => import("../commons/OfflineToast"), {
  ssr: false,
});

const DynamicNProgress = dynamic(() => import("../commons/NProgress"), {
  ssr: false,
});

const DynamicWebHeader = dynamic(() => import("../commons/WebHeader"));

export default function Layout({ children }: { children: ReactNode }) {
  const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

  return (
    <>
      {!isProduction && (
        <div className="flex align-items-center justify-content-center text-xs text-primary border-bottom-1 surface-ground border-primary p-1">
          NEXT_PUBLIC_VERCEL_ENV:
          <span className="ml-1 font-semibold">
            {process.env.NEXT_PUBLIC_VERCEL_ENV}
          </span>
        </div>
      )}
      {/* ============================================= */}
      <main className="relative sm:py-0">
        <DynamicNProgress />
        <DynamicOfflineToast />
        <DynamicToastContainer
          position={toast.POSITION.BOTTOM_CENTER}
          transition={Slide}
          hideProgressBar={false}
        />
        <LazyMotion features={loadFeatures}>
          <DynamicWebHeader />
          {children}
        </LazyMotion>
      </main>
    </>
  );
}
