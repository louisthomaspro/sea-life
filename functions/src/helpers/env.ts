import { defineSecret, defineString } from "firebase-functions/params";

export const host = defineString("HOST", {
  default: "http://localhost:3000",
  description: "Host of the frontend",
  input: {
    select: {
      options: [
        { value: "http://localhost:3000" },
        { value: "https://sea-life.vercel.app" },
      ],
    },
  },
});

export const revalidationSecret = defineSecret("REVALIDATION_SECRET");

export const iucnToken = defineSecret("IUCN_TOKEN");
