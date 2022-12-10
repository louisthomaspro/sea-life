import { ImageLoaderProps } from "next/image";
const getRandomValues = require("get-random-values");
export const shader = require("shader");

export const blurDataURL = () => {
  return `data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`;
};

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#0058AA" offset="20%" />
      <stop stop-color="#083262" offset="50%" />
      <stop stop-color="#0058AA" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#0058AA" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const firebaseStorageLoader = ({
  src, // filePath ex: lives/50968/177fa4f7-f02d-4409-9772-d6378504c86f
  width,
  quality,
}: ImageLoaderProps) => {
  const url =
    "https://firebasestorage.googleapis.com/v0/b/sea-guide.appspot.com/o/";
  const fullPath = `${url}${encodeURIComponent(src)}`;
  const prefix = ".webp?alt=media";
  return `${fullPath}_${width}x${width}${prefix}`;
};

export const uuidv4 = (): string => {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    // tslint:disable-next-line:no-bitwise
    (c ^ (getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
};

export const revalidateId = (id: string) => {
  return fetch("/api/revalidate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: `/life/${id}` }),
  });
};

export const searchTreeClassification = (element: any, matchingSlug: any): any => {
  if (element?.permalink == matchingSlug) {
    return element;
  } else if (element.children != null) {
    var i;
    var result = null;
    for (i = 0; result == null && i < element.children.length; i++) {
      result = searchTreeClassification(element.children[i], matchingSlug);
    }
    return result;
  }
  return null;
};
