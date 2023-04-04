const fetch = require("node-fetch");
import * as functions from "firebase-functions";
import { ISpecies } from "sea-life/types/Species";
import { IFishbaseSpecies } from "sea-life/types/fishbase/Species";
import { Database, TableData } from "duckdb";

export const populateFishbase = async (species: ISpecies) => {
  // Init database
  const db = new Database("/tmp/fishbase.duckdb");
  db.connect();

  await asyncQuery(db, `SET temp_directory='/tmp';`);
  await asyncQuery(db, `SET extension_directory='/tmp';`);
  await asyncQuery(db, `SET home_directory='/tmp';`);

  // Create table from parquet file
  const url = "https://fishbase.ropensci.org/fishbase/species.parquet";
  // await db.all(
  //   `CREATE TEMPORARY TABLE fishbase AS SELECT * FROM parquet_scan('${url}');`
  // );

  await asyncQuery(db, 'INSTALL httpfs;')
  await asyncQuery(db, 'LOAD httpfs;')
  

  // Query
  const query = `SELECT * FROM parquet_scan('${url}') WHERE LOWER(Genus) = LOWER('${
    species.scientific_name.split(" ")[0]
  }') AND LOWER(Species) = LOWER('${species.scientific_name.split(" ")[1]}')`;

  const res = await asyncQuery(db, query);

  if (res.length === 0) {
    functions.logger.log("No Fishbase result for: ", species.scientific_name);
    return species;
  }

  const fishbaseSpecies: IFishbaseSpecies = res[0] as any;

  // ID
  species.external_ids.fishbase = fishbaseSpecies.SpecCode.toString();

  // DEPTH (m)
  // Other fields: DepthRangeShallow, DepthRangeDeep
  if (fishbaseSpecies.DepthRangeComShallow !== null) {
    species.depth_min = fishbaseSpecies.DepthRangeComShallow;
  }
  if (fishbaseSpecies.DepthRangeComDeep !== null) {
    species.depth_max = fishbaseSpecies.DepthRangeComDeep;
  }

  // LENGTH (cm)
  // Other fields: LengthFemale, CommonLengthF
  if (fishbaseSpecies.CommonLength !== null) {
    if (species.sizes === undefined) species.sizes = {};
    species.sizes.common_length = fishbaseSpecies.CommonLength;
  }
  if (fishbaseSpecies.Length !== null) {
    if (species.sizes === undefined) species.sizes = {};
    species.sizes.max_length = fishbaseSpecies.Length;
  }

  return species;
};

const asyncQuery = async (db: Database, query: string): Promise<TableData> => {
  return new Promise((resolve, reject) => {
    db.all(query, (err, res) => {
      if (err) {
        functions.logger.error(err);
        reject(new Error("Error fetching Fishbase database"));
      } else {
        resolve(res);
      }
    });
  });
};
