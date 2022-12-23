import {
  AnimatePresence,
  LazyMotion,
  Variants,
  m,
  domAnimation,
} from "framer-motion";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import NProgress from "./NProgress";
import OfflineToast from "./OfflineToast";

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
      <NProgress />
      <OfflineToast />
      <main style={{ maxWidth: "400px", border: "1px solid black" }}>
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} mode="sync">
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                width: "100%",
              }}
            >
              {children}
            </div>
            {/* </m.div> */}
          </AnimatePresence>
        </LazyMotion>
      </main>
    </>
  );
}
