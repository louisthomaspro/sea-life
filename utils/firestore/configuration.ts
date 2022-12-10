import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";
import { firestore } from "../../firebase/clientApp";

const collectionName = "configuration";

export const getClassification = () => {
  const document = getDoc(doc(firestore, `${collectionName}/classification`));
  return document.then((doc) => doc.data()) as Promise<any>;
};