import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  addDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore/lite";
import { firestore } from "../../firebase/clientApp";
import { ISpecies } from "../../types/Species";
import { IContributionForm } from "../../types/Contribution";
import { getSpeciesIdFromScientificName } from "../helper";

const collectionName = "species";

export const getSpeciesById = (id: string) => {
  const document = getDoc(doc(firestore, `${collectionName}/${id}`));
  return document.then((doc) => doc.data()) as Promise<ISpecies>;
};

export const updateSpeciesById = async (id: string, data: any) => {
  const speciesRef = doc(firestore, `${collectionName}/${id}`);
  await updateDoc(speciesRef, data);
};

export const deleteSpeciesById = async (id: string) => {
  const speciesRef = doc(firestore, `${collectionName}/${id}`);
  await updateDoc(speciesRef, { is_deleted: true });
};

export const restoreSpeciesById = async (id: string) => {
  const speciesRef = doc(firestore, `${collectionName}/${id}`);
  await updateDoc(speciesRef, { is_deleted: false });
};

export const saveSpeciesByScientificName = async (scientificName: string) => {
  const id = getSpeciesIdFromScientificName(scientificName);
  const speciesRef = doc(firestore, `${collectionName}/${id}`);
  await setDoc(speciesRef, {
    id,
    scientific_name: scientificName.toLowerCase(),
  });
};

export const getAllSpecies = async (
  taxonomyGroups?: string[]
): Promise<ISpecies[]> => {
  const queryConstraints = [];
  if (taxonomyGroups) {
    queryConstraints.push(
      where("taxonomy_ids", "array-contains-any", taxonomyGroups)
    );
  }
  queryConstraints.push(where("is_deleted", "!=", true));
  const q = query.apply(null, [
    collection(firestore, collectionName),
    ...queryConstraints,
  ]);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as any);
};

export const getAllDeletedSpecies = async (): Promise<ISpecies[]> => {
  const queryConstraints = [];
  queryConstraints.push(where("is_deleted", "==", true));
  const q = query.apply(null, [
    collection(firestore, collectionName),
    ...queryConstraints,
  ]);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as any);
};

export const saveContribution = async (suggestionForm: IContributionForm) => {
  const speciesRef = doc(
    firestore,
    `${collectionName}/${suggestionForm.speciesId}`
  );
  const suggestedUpdateCollectionRef = collection(speciesRef, "contributions");

  return addDoc(suggestedUpdateCollectionRef, {
    status: "pending",
    species: speciesRef,
    user: doc(firestore, `users/${suggestionForm.userId}`),
    timestamp: Timestamp.fromDate(new Date()),
    field: suggestionForm.field,
    newValue: suggestionForm.newValue,
    comment: suggestionForm.comment,
  });
};

/**
 * Add species to subcollection of species named "versions" and update the species document with the new values
 */
export const saveNewSpeciesVersion = async (id: string, data: any) => {
  const speciesRef = doc(firestore, `${collectionName}/${id}`);
  const versionsCollectionRef = collection(speciesRef, "versions");

  const speciesSnapshot = await getDoc(speciesRef);
  const speciesData = speciesSnapshot.data();

  await addDoc(versionsCollectionRef, {
    ...speciesData,
    timestamp: Timestamp.fromDate(new Date()),
  });

  await updateSpeciesById(id, data);
};

// Get all suggested updates for a species

// firebase.firestore().collection("species")
//   .doc(speciesId)
//   .collection("suggestedUpdates")
//   .get()
//   .then((snapshot) => {
//     snapshot.forEach((suggestion) => {
//       console.log("Suggested update:", suggestion.data());
//     });
//   });

// Get the species information along with the number of pending suggested updates

// const speciesId = "species1";
// firebase.firestore().collection("species").doc(speciesId).get().then((species) => {
//   firebase.firestore().collection("species")
//     .doc(speciesId)
//     .collection("suggestedUpdates")
//     .where("status", "==", "pending")
//     .get()
//     .then((suggestionsSnapshot) => {
//       console.log("Species information:", species.data());
//       console.log("Number of pending suggestions:", suggestionsSnapshot.size);
//     });
// });
