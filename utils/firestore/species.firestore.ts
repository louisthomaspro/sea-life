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
} from "firebase/firestore/lite";
import { firestore } from "../../firebase/clientApp";
import { ITaxa, ITaxaResponse } from "../../types/INaturalist/TaxaResponse";
import { ISpecies } from "../../types/Species";
import { uuidv4 } from "../helper";

const collectionName = "species";

export const getSpecies = (id: string) => {
  const document = getDoc(doc(firestore, `${collectionName}/${id}`));
  return document.then((doc) => doc.data()) as Promise<ISpecies>;
};

export const getAllSpecies = async (
  scientificName?: string
): Promise<ISpecies[]> => {
  const queryConstraints = [];
  if (scientificName) {
    queryConstraints.push(
      where("taxonomy_ids", "array-contains", scientificName)
    );
  }
  const q = query.apply(null, [
    collection(firestore, collectionName),
    ...queryConstraints,
  ]);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as any);
};

export const getAllSpeciesByGroupList = async (
  taxaId: string[]
): Promise<ISpecies[]> => {
  const queryConstraints = [];
  if (taxaId) {
    queryConstraints.push(
      where("taxonomy_ids", "array-contains-any", taxaId)
    );
  }
  const q = query.apply(null, [
    collection(firestore, collectionName),
    ...queryConstraints,
  ]);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as any);
};