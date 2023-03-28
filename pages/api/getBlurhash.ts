import { NextApiRequest, NextApiResponse } from "next";
import { getPlaiceholder } from "plaiceholder";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { imageUrl } = req.body;

  try {
    const { blurhash } = await getPlaiceholder(imageUrl, { size: 40});

    res.status(200).json(blurhash);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate blurhash." });
  }
}
