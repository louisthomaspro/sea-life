import type { NextApiRequest, NextApiResponse } from "next";
import {
  createLife,
  getTaxaFromINaturalist,
} from "../../utils/firestore/life.firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { parent_ids, species_ids } = req.body;

  let speciesFailed = [];
  let speciesSuccess = [];

  let data = [];
  for (const key in species_ids) {
    data.push([...parent_ids, species_ids[key]]);
  }

  for (const i in data) {
    let failed = false;
    const speciesId = data[i][data[i].length - 1];
    // check if taxonomies is correct
    const species = await getTaxaFromINaturalist(speciesId);
    const ancestor_ids = species.ancestors.map((a) => a.id.toString());
    for (let j = 1; j < data[i].length - 1; j++) {
      if (!ancestor_ids.includes(data[i][j])) {
        failed = true;
        console.log("failed", data[i][j]);
        console.log("ancestor_ids", ancestor_ids);
        break;
      }
    }

    if (failed) {
      speciesFailed.push(speciesId);
      console.log("failed", speciesId);
    } else {
      speciesSuccess.push(speciesId);
      await createLife(data[i]);
      console.log("success", speciesId);
    }
    await timeout(500);
  }

  res.status(200).json({ speciesSuccess, speciesFailed });
}

function timeout(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/*
curl --location --request POST 'localhost:3000/api/gsheetMigration' \
--header 'Authorization: <token>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "parent_ids": ["fauna", "47178", "47233", "86126"],
    "species_ids": [
"118641"
    ]
}'
 */
