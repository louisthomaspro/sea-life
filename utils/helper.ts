import { ImageLoaderProps } from "next/image";
import path from "path";
import { regionsList } from "../constants/regions";
import {
  ISearchResponse,
  ITaxaScored,
} from "../types/INaturalist/SearchResponse";
import { ITaxa, ITaxaResponse } from "../types/INaturalist/TaxaResponse";
import { ISpecies } from "../types/Species";
import { getGroupByScientificNameList } from "./firestore/group.firestore";
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
    "https://firebasestorage.googleapis.com/v0/b/sea-life-app.appspot.com/o/";
  const fullPath = `${url}${encodeURIComponent(src)}`;
  const prefix = ".webp?alt=media";
  return `${fullPath}_${width}x${width}${prefix}`;
};

export const searchTreeClassification = (
  element: any,
  matchingSlug: any
): any => {
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

// Capitalize first letter of a string
export const capitalizeFirstLetter = (string: string) => {
  if (!string) return "";
  if (typeof string !== "string") return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Capitalize first letter of each word in a string
export const capitalizeWords = (string: string) => {
  if (!string) return "";
  if (typeof string !== "string") return "";
  const words = string.split(" ");
  const capitalizedWords = words.map(
    (word) => word[0].toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(" ");
};

export const iNaturalistSearchOnlySpecies = async (
  query: string
): Promise<ITaxa[]> => {
  let taxaList: ITaxa[] = [];
  try {
    const res = await fetch(
      `https://api.inaturalist.org/v1/search?sources=taxa&per_page=5&locale=fr&q=${query}`
    );
    const jsonData: ISearchResponse = await res.json();
    taxaList = jsonData.results.map((r) => r.record);
    taxaList = taxaList.filter(
      (t: ITaxa) =>
        t.rank === "species" && t.is_active === true && t.extinct === false
    );
  } catch (err) {
    console.log(err);
  }
  return taxaList;
};

export const getSpeciesIdFromScientificName = (scientificName: string) => {
  const id = scientificName
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
    .replace(" ", "-");
  return id;
};

// export const iNaturalistGetSpeciesById = async (id: number): Promise<ITaxa> => {
//   let taxa: ITaxa = null;
//   try {
//     const res = await fetch(
//       `https://api.inaturalist.org/v1/taxa/${id.toString()}?per_page=5&locale=fr`
//     );
//     const jsonData: ITaxaResponse = await res.json();
//     if (jsonData.results.length > 0) {
//       taxa = jsonData.results[0];
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   return taxa;
// };
