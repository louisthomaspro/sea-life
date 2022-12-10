import { shader } from "../utils/helper";

const dev = process.env.NODE_ENV !== "production";

export const tapAnimationDuration = 0.96;

export const whileTapAnimationIconButton = {
  backgroundColor: shader("#FFFFFF", -0.1),
  transition: { duration: 0.1, ease: "easeInOut" },
};

export const serverUrl = dev
  ? "http://localhost:3000"
  : "https://sea-guide.vercel.app";
