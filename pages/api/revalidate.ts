import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Invalid token" });
  }

  const paths : string[] = req.body.paths;

  console.log('Revalidating paths :', paths);

  try {
    // this should be the actual path not a rewritten path
    // e.g. for "/blog/[slug]" this should be "/blog/post-1"
    await Promise.all(paths.map(path => res.revalidate(path)));
    return res.json({ revalidated: true });
  } catch (err) {
    console.error(err);
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
};

export default handler;