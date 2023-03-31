import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { host } from "..";
import { regionsList } from "../constants/regions";

const db = getFirestore();

export const onDemandRevalidation = async (paths: string[], secret: string) => {
  functions.logger.info("Revalidating paths: ", paths);
  try {
    await fetch(`${host.value()}/api/revalidate?secret=${secret}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        paths,
      }),
    });
  } catch (error) {
    functions.logger.error(error);
    throw new Error("Error during revalidation: " + paths.join(","));
  }
};

/**
 * Returns all the paths for a group (for all regions)
 * Ex: /explore/mediterranean-sea/fauna/fishes/gobies
 */
export const getGroupPaths = (groupData: any) => {
  let paths: string[] = [];
  const group_slug = groupData.slug;
  regionsList.forEach((region) => {
    paths.push("/explore/" + region + group_slug);
  });
  return paths;
};

/**
 * Returns all the paths for a group's parents (for all regions)
 * Ex: /explore/mediterranean-sea/fauna/fishes(/gobies)
 */
export const getParentGroupPaths = (groupData: any) => {
  let paths: string[] = [];
  const group_slug = groupData.slug;
  regionsList.forEach((region) => {
    if (groupData.parent_id) {
      const parent_slug = group_slug.split("/").slice(0, -1).join("/");
      paths.push("/explore/" + region + parent_slug);
    }
  });
  return paths;
};

export const getParentGroupPathsForSpecies = async (speciesData: any) => {
  const groups = await db
      .collection("/group")
      .where("includes", "array-contains-any", speciesData.taxonomy_ids)
      .where("show_species", "==", true)
      .get();

  const parentGroup = groups.docs[0];
  return getGroupPaths(parentGroup.data());
}