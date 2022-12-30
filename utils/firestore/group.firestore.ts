import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
  orderBy,
} from "firebase/firestore/lite";
import { firestore } from "../../firebase/clientApp";
import { IGroup } from "../../types/Group";
import { ITaxa, ITaxaResponse } from "../../types/INaturalist/TaxaResponse";
import { ISpecies } from "../../types/Species";
import { uuidv4 } from "../helper";

const collectionName = "group";

export const getGroup = (id: string) => {
  const document = getDoc(doc(firestore, `${collectionName}/${id}`));
  return document.then((doc) => doc.data()) as Promise<IGroup>;
};

export const getGroupByPermalink = (permalink: string) => {
  const q = query(
    collection(firestore, collectionName),
    where("permalink", "==", permalink)
  );
  const querySnapshot = getDocs(q);
  return querySnapshot.then((doc) => {
    if (doc.empty) {
      console.log("No matching documents for group: ", permalink);
      return null;
    } else {
      return doc.docs[0].data() as IGroup;
    }
  });
};

export const getChildrenGroups = async (
  parentId?: string
): Promise<ISpecies[]> => {
  const queryConstraints = [];
  if (parentId) {
    queryConstraints.push(where("parent_id", "==", parentId), orderBy("order"));
  }
  const q = query.apply(null, [
    collection(firestore, collectionName),
    ...queryConstraints,
  ]);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as any);
};
