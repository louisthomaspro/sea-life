import * as functions from "firebase-functions";
import { ISpecies } from "../../types/Species";
import { iucnToken, revalidationSecret } from "./helpers/env";
import { populateINaturalist } from "./helpers/populate/inaturalist";
import { populateIUCN } from "./helpers/populate/iucn";
import { onDemandRevalidation } from "./helpers/revalidation";
import { populateFishbase } from "./helpers/populate/fishbase";
import { populateBlurhashMissing } from "./helpers/populate/blurhash";

/**
 * On species update, revalidate the species page
 * (except if the species is_deleted field is updated)
 */
exports.revalidationOnSpeciesUpdate = functions
  .region("europe-west1")
  .runWith({ secrets: [revalidationSecret] })
  .firestore.document("species/{id}")
  .onUpdate(async (change, context) => {
    if (change.before.data().is_deleted !== change.after.data().is_deleted) {
      // Species deleted or restored
      return null;
    }

    functions.logger.info("Revalidate species", context.params.id);
    await onDemandRevalidation(
      [`/species/${context.params.id}`],
      revalidationSecret.value()
    );
    return null;
  });

/**
 * On species create, populate the species with data from external sources
 * INaturalist ID is required
 *
 * Sources: INaturalist, UICN
 */
exports.populateSpeciesOnSpeciesCreate = functions
  .region("europe-west1")
  .runWith({ secrets: [revalidationSecret, iucnToken] })
  .firestore.document("species/{id}")
  .onCreate(async (snapshot, context) => {
    let species = snapshot.data() as ISpecies;

    if (!species?.external_ids?.inaturalist) {
      throw new functions.https.HttpsError(
        "aborted",
        "No iNaturalist ID found"
      );
    }
    const id = context.params.id;
    const scientificName = species.scientific_name;
    functions.logger.info("Populate species:", scientificName, `(id: ${id})`);

    try {
      functions.logger.info("Populate from INaturalist");
      species = await populateINaturalist(species);

      functions.logger.info("Populate from IUCN");
      species = await populateIUCN(species, iucnToken.value());

      functions.logger.info("Populate from fishbase");
      species = await populateFishbase(species);

      functions.logger.info("Populate blurhash");
      species = await populateBlurhashMissing(species);

      await snapshot.ref.set(species); // it will call revalidationOnSpeciesUpdate
    } catch (error) {
      functions.logger.error(error);
      await snapshot.ref.delete();
      throw new functions.https.HttpsError(
        "aborted",
        "Species population cancelled because of an error. Species deleted"
      );
    }
    
    return null;
  });
