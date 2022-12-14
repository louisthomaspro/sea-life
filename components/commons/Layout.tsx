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
      <main style={{ padding: "60px 0" }}>
        <NProgress />
        <OfflineToast />
        <LazyMotion features={domAnimation}>
          {/* <AnimatePresence initial={false} mode="wait"> */}
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
          {/* </AnimatePresence> */}
        </LazyMotion>
      </main>
    </>
  );
}
