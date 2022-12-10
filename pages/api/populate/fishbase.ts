import { m } from "framer-motion";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import {
  getAllSpecies,
  updateLife,
} from "../../../utils/firestore/life.firestore";
var parquet = require("parquetjs-lite");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json({ message: "Batch starting" });
  console.log("Batch starting");

  console.log("Reading parquet file");
  let reader = await parquet.ParquetReader.openFile(
    path.join(process.cwd(), "fishbase.parquet")
    // path.join(process.cwd(), "sealifebase.parquet")
  );
  let cursor = reader.getCursor([
    "Genus",
    "Species",
    "BodyShapeI",
    "DemersPelag",
    "LongevityWild",
    "DepthRangeShallow",
    "DepthRangeDeep",
    "DepthRangeComShallow",
    "DepthRangeComDeep",
    "Length",
    "LTypeMaxM", // TL, SL, WD...
    "LengthFemale",
    "LTypeMaxF",
    "CommonLength",
    "LTypeComM",
    "CommonLengthF",
    "LTypeComF",
    "Dangerous",
    "Comments",
  ]);

  const approvedTypes = ["WD", "TL", "SL"];

  let record = null;
  let fishbaseMap = {} as any;
  while ((record = await cursor.next())) {
    fishbaseMap[
      record["Genus"].toLowerCase() + " " + record["Species"].toLowerCase()
    ] = record;
  }
  await reader.close();

  console.log("Fetch species");
  const speciesList = await getAllSpecies();
  console.log(`Found ${speciesList.length} species`);

  for (const i in speciesList) {
    const species = speciesList[i];

    console.log(
      `(${Number(i) + 1} / ${speciesList.length}) ${
        species.scientific_name
      } - ${species.id}`
    );

    const fishbaseRecord = fishbaseMap[species.scientific_name.toLowerCase()];
    const body_shape = fishbaseRecord?.["BodyShapeI"] ?? null;

    let common_length = null;
    let common_length_type =
      fishbaseRecord?.["LTypeComM"] ?? fishbaseRecord?.["LTypeComF"] ?? null;
    if (approvedTypes.includes(common_length_type)) {
      common_length =
        fishbaseRecord?.["CommonLength"] ??
        fishbaseRecord?.["CommonLengthF"] ??
        null;
    } else {
      common_length_type = null;
    }

    let max_length = null;
    let max_length_type =
      fishbaseRecord?.["LTypeMaxM"] ?? fishbaseRecord?.["LTypeMaxF"] ?? null;
    if (approvedTypes.includes(max_length_type)) {
      max_length =
        fishbaseRecord?.["Length"] ?? fishbaseRecord?.["LengthFemale"] ?? null;
    } else {
      max_length_type = null;
    }

    const dangerous = fishbaseRecord?.["Dangerous"] ?? null;
    const habitat = fishbaseRecord?.["DemersPelag"] ?? null;
    const longevity = fishbaseRecord?.["LongevityWild"] ?? null;
    const common_depth_min =
      fishbaseRecord?.["DepthRangeComShallow"] ??
      fishbaseRecord?.["DepthRangeShallow"] ??
      null;
    const common_depth_max =
      fishbaseRecord?.["DepthRangeComDeep"] ??
      fishbaseRecord?.["DepthRangeDeep"] ??
      null;

    await updateLife(
      {
        body_shape: species.body_shape ?? body_shape,
        common_length: species.common_length ?? common_length,
        common_length_type: species.common_length_type ?? common_length_type,
        max_length: species.max_length ?? max_length,
        max_length_type: species.max_length_type ?? max_length_type,
        dangerous: species.dangerous ?? dangerous,
        habitat: species.habitat ?? habitat,
        longevity: species.longevity ?? longevity,
        common_depth_min: species.common_depth_min ?? common_depth_min,
        common_depth_max: species.common_depth_max ?? common_depth_max,
      },
      species.id
    );
    console.log(
      body_shape,
      common_length,
      max_length,
      dangerous,
      habitat,
      longevity,
      common_depth_min,
      common_depth_max
    );
    // await timeout(100);
  }

  console.log("Batch finished");
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
