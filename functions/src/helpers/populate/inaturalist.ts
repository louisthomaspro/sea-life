const fetch = require("node-fetch");
import * as functions from "firebase-functions";
import { ISpecies } from "sea-life/types/Species";
import { ITaxaResponse } from "sea-life/types/INaturalist/TaxaResponse";

export const populateINaturalist = async (species: ISpecies) => {
  let taxaResponse: ITaxaResponse;
  try {
    const response = await fetch(
      `https://api.inaturalist.org/v1/taxa/${species.external_ids.inaturalist}?all_names=true&locale=fr`
    );
    taxaResponse = await response.json();
  } catch (error) {
    functions.logger.error(error);
    throw new Error("Error fetching INaturalist taxa");
  }
  if (taxaResponse.results.length === 0) {
    throw new Error("No INaturalist species found. Abort...");
  }
  const taxa = taxaResponse.results[0];

  // ID
  species.external_ids.inaturalist = taxa.id.toString();

  // COMMON NAME
  species.common_names = {
    fr: taxa.preferred_common_name ? [taxa.preferred_common_name] : [],
    en: taxa.english_common_name ? [taxa.english_common_name] : [],
  }

  // WIKIPEDIA URL
  species.wikipedia_url = taxa.wikipedia_url;

  // TAXONOMY TREE
  species.taxonomy = taxa.ancestors.map((ancestor) => ({
    scientific_name: ancestor.name.toLowerCase(),
    rank: ancestor.rank,
    common_name: {
      fr: ancestor.preferred_common_name || null,
      en: ancestor.english_common_name || null,
    },
  }));

  // TAXONOMY IDS
  species.taxonomy_ids = taxa.ancestors.map((ancestor) =>
    ancestor.name.toLowerCase()
  );

  // PHOTOS
  species.photos = taxa.taxon_photos.slice(0, 5).map((photo) => ({
    original_url: photo.photo.original_url,
    attribution: photo.photo.attribution,
  }));

  return species;
};
