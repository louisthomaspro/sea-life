import * as functions from "firebase-functions";
import { revalidationSecret } from ".";
import {
  getParentGroupPathsForSpecies,
  onDemandRevalidation,
} from "./helpers/revalidation";

/**
 * On group create/update, update the species count for the group
 */
exports.revalidationOnSpeciesWrite = functions
  .region("europe-west1")
  .runWith({ secrets: [revalidationSecret] })
  .firestore.document("species/{id}")
  .onWrite(async (change, context) => {

    if (change.before.exists && change.after.exists) {
      if (change.before.data().is_deleted !== change.after.data().is_deleted) {
        functions.logger.info("Revalidate species skipped, group is handling revalidation", context.params.id);
        return null;
      }
    }

    functions.logger.info("Revalidate species", context.params.id);
    const groupPaths = await getParentGroupPathsForSpecies(change.after.data());

    if (change.after.exists) {
      // Species created or updated
      const paths = [...groupPaths, `/species/${context.params.id}`];
      await onDemandRevalidation(paths, revalidationSecret.value());
      return null;
    } else {
      // Species deleted
      await onDemandRevalidation(groupPaths, revalidationSecret.value());
      return null;
    }
  });
