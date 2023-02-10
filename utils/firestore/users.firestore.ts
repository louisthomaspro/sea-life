import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore/lite";
import { firestore } from "../../firebase/clientApp";
import { IUser } from "../../types/User";

const collectionName = "users";

export const getUser = (email: string) => {
  const document = getDoc(doc(firestore, `${collectionName}/${email}`));
  return document.then((doc) => doc.data()) as Promise<IUser>;
};

export const createUser = (data: IUser, email: string) => {
  return setDoc(doc(firestore, collectionName, email), data);
};

export const addFavorite = (id: string, email: string) => {
  return updateDoc(doc(firestore, collectionName, email), {
    favorites: arrayUnion(id),
  });
};

export const removeFavorite = (id: string, email: string) => {
  return updateDoc(doc(firestore, collectionName, email), {
    favorites: arrayRemove(id),
  });
};
