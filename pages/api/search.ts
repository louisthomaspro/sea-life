import { collection, getDocs, query, where } from "firebase/firestore/lite";
import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "../../firebase/clientApp";
import { ILife } from "../../types/Life";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const q = query(
    collection(firestore, "lives"),
    where("type", "==", "species")
  );
  const querySnapshot = await getDocs(q);
  const results = await querySnapshot.docs.map((doc) => doc.data() as ILife);

  const set = new Set();

  for (const result of results) {
    set.add(result.common_length_type);
    set.add(result.max_length_type);
  }
  // const formatted = results.map((result) => {
  //   return { id: result.id };
  // });

  res.status(200).json({ results: Array.from(set) });
}
