import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const url = `https://graph.facebook.com/v15.0/me/feed?fields=permalink_url&access_token=${process.env.FACEBOOK_PERMANENT_ACCESS_TOKEN}`;
  const response = await fetch(url);
  const json = await response.json();
  res.status(200).json(json.data);
};
export default handler;
