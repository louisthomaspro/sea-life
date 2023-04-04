const fetch = require("node-fetch");
import * as functions from "firebase-functions";
import { ISpecies } from "sea-life/types/Species";
import { IIucnResponse } from "sea-life/types/IIucn";

export const populateIUCN = async (species: ISpecies, token: string) => {
  let iucnResponse: IIucnResponse;
  try {
    const response = await fetch(
      `https://apiv3.iucnredlist.org/api/v3/species/${species.scientific_name}?token=${token}`
    );
    iucnResponse = await response.json();
  } catch (error) {
    functions.logger.error(error);
    throw new Error("Error fetching IUCN");
  }
  if (iucnResponse.result.length === 0) {
    functions.logger.log("No IUCN result for: ", species.scientific_name);
    return species;
  }

  let iucn = iucnResponse.result[0];

  // ID
  species.external_ids.iucn = iucn.taxonid.toString();

  // CONSERVATION STATUS
  species.conservation_status = iucn.category;

  return species;
};
