// Get blob from external url and upload to storage (Back)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { url } = req.body;
  const blob = await fetch(url).then((r) => r.blob());

  res.setHeader("Content-Type", blob.type);
  const buffer = await blob.arrayBuffer();
  res.send(Buffer.from(buffer) as any);
}

// Client
const blob = await fetch("http://localhost:3000/api/getINaturalistImage", {
  method: "POST",
  mode: "cors",
  cache: "default",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
}).then((res) => res.blob());

...

const storageRef = ref(storage, `${filePath}.${extension}`);
await uploadBytes(storageRef, blob);