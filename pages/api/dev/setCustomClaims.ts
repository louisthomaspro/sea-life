import { NextApiRequest, NextApiResponse } from "next";
import setCustomClaims from "../admin/setCustomClaims";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (process.env.NODE_ENV !== "development") {
    return res.status(404).json({ message: "Not Found" });
  }

  return setCustomClaims(req, res)
}
