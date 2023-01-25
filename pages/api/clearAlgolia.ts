import type { NextApiRequest, NextApiResponse } from "next";
import { algoliaAdmin } from "../../algolia/clientApp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await algoliaAdmin.initIndex("sea-life").clearObjects();
  res.status(200).json({ message: "Algolia cleared" });
}

/*
curl --location --request POST 'localhost:3000/api/clearAlgolia' \
--data-raw ''
*/
