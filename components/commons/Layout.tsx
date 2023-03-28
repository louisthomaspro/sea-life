import { LazyMotion, Variants } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ReactNode } from "react";
import NProgress from "./NProgress";
import OfflineToast from "./OfflineToast";
import WebHeader from "./WebHeader";
const loadFeatures = () =>
  import("../../utils/feature.js").then((res) => res.default);

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const variants: Variants = {
    initial: () => {
      return {
        opacity: 0,
      };
    },
    enter: () => {
      return {
        opacity: 1,
        transition: {
          delay: 0.1,
        },
      };
    },
    exit: () => {
      return {
        opacity: 0,
      };
    },
  };

  return (
    <>
      <main className="sm:py-0">
        <NProgress />
        <OfflineToast />
        <LazyMotion features={loadFeatures}>
          <WebHeader className="hidden sm:block" />
          {/* <m.div
              key={router.asPath}
              initial="initial"
              animate="enter"
              exit="exit"
              variants={variants}
              transition={{
                duration: 0.2,
              }}
            > */}
          {children}
          {/* </m.div> */}
        </LazyMotion>
      </main>
    </>
  );
}
