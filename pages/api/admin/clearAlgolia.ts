import type { NextApiRequest, NextApiResponse } from "next";
import { algoliaAdmin } from "../../../algolia/clientApp";
import { withAuthApi } from "../../../hooks/withAuth";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<any>
) => {
  await algoliaAdmin.initIndex("sea-life").clearObjects();
  res.status(200).json({ message: "Algolia cleared" });
}
export default withAuthApi(handler);
