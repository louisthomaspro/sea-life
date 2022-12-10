import type { NextApiRequest, NextApiResponse } from "next";
import {
  getAllSpecies,
  updateLife,
} from "../../../utils/firestore/life.firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json({ message: "Batch starting" });
  console.log("Batch starting");

  console.log("Fetch species");
  const speciesList = await getAllSpecies();
  console.log(`Found ${speciesList.length} species`);

  for (const i in speciesList) {
    const species = speciesList[i];
    let iucnCategory: string = null;

    console.log(
      `(${Number(i) + 1} / ${speciesList.length}) ${
        species.scientific_name
      } - ${species.id}`
    );
    try {
      const res = await fetch(
        `https://apiv3.iucnredlist.org/api/v3/species/${encodeURIComponent(
          species.scientific_name
        )}?token=${process.env.IUCN_API_KEY}`
      );
      const jsonData: any = await res.json();
      if (jsonData?.result?.length > 0) {
        iucnCategory = jsonData.result[0].category;
      }
    } catch (err) {
      console.log(err);
    }

    await updateLife({ conservation_status: iucnCategory }, species.id);
    console.log(`IUCN category : ${iucnCategory}`);
    await timeout(1000);
  }

  console.log("Batch finished");
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
