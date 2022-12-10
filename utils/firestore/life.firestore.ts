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
import { ILife } from "../../types/Life";
import { uuidv4 } from "../helper";

const collectionName = "lives";

export const getLife = (id: string) => {
  const document = getDoc(doc(firestore, `${collectionName}/${id}`));
  return document.then((doc) => doc.data()) as Promise<ILife>;
};

export const getAllSpecies = async (): Promise<ILife[]> => {
  const q = query(
    collection(firestore, collectionName),
    where("type", "==", "species")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as ILife);
};

export const getCategories = async (): Promise<ILife[]> => {
  const q = query(
    collection(firestore, collectionName),
    where("id", "in", ["fauna", "flora"])
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as ILife);
};

export const getChildren = async (
  parent_id: string,
  type?: string
): Promise<ILife[]> => {
  const queryConstraints = [];
  queryConstraints.push(where("parent_id", "==", parent_id));
  if (type) {
    queryConstraints.push(where("type", "==", type));
  }
  const q = query.apply(null, [
    collection(firestore, collectionName),
    ...queryConstraints,
  ]);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as ILife);
};

export const getGroups = async (): Promise<ILife[]> => {
  const q = query(
    collection(firestore, collectionName),
    where("type", "==", "group")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as ILife);
};

export const setLife = (data: ILife, id: string) => {
  return setDoc(doc(firestore, collectionName, id), data);
};

export const updateLife = (data: any, id: string) => {
  return updateDoc(doc(firestore, collectionName, id), data);
};

export const getTaxaFromINaturalist = async (
  taxaId: number
): Promise<ITaxa> => {
  let taxa: ITaxa = null;
  try {
    const res = await fetch(
      `https://api.inaturalist.org/v1/taxa/${taxaId}?locale=fr`
    );
    const jsonData: ITaxaResponse = await res.json();
    taxa = jsonData.results[0];
  } catch (err) {
    console.log(err);
  }
  return taxa;
};

export const iNaturalistSearch = async (query: any): Promise<ITaxa[]> => {
  let taxaList: ITaxa[] = [];
  try {
    const res = await fetch(`https://api.inaturalist.org/v1/search?q=${query}`);
    const jsonData: any = await res.json();
    taxaList = jsonData.results.map((r: any) => r.record);
    taxaList = taxaList.filter((t: ITaxa) => t.rank == "species");
  } catch (err) {
    console.log(err);
  }
  return taxaList;
};

/**
 * Create life: Create parents and then the species
 * @param ids Array of INaturalist ids. The order means the parent.
 */
export const createLife = async (ids: string[]) => {
  // Create each ids
  for (let index = 1; index < ids.length; index++) {
    // index = 1 to skip main parent (ex: fauna)
    const id = ids[index];
    const parentDoc = await getDoc(doc(firestore, `${collectionName}/${id}`));
    if (!parentDoc.exists()) {
      const taxa = await getTaxaFromINaturalist(parseInt(id));
      const parent_ids = ids.slice(0, index);
      let life = taxaToLife(taxa, parent_ids);
      // life = await uploadLifeImage(life);
      await setDoc(doc(firestore, collectionName, taxa.id.toString()), life);
    }
  }
};

export const deleteLife = async (lifeId: string) => {
  return deleteDoc(doc(firestore, collectionName, lifeId));
};

export const taxaToLife = (taxa: ITaxa, parent_ids: string[] = []): ILife => {
  const life: ILife = {
    id: taxa.id.toString(),
    type: (taxa.rank === "species" ? "species" : "group").toLowerCase(),

    scientific_name: taxa.name ?? null,
    french_common_name: taxa.preferred_common_name ?? null,
    english_common_name: taxa.english_common_name ?? null,
    french_other_names: null,
    english_other_names: null,
    group_short_description: null,
    group_long_description: null,

    photos: [],
    wikipedia_url: taxa.wikipedia_url ?? null,
    taxonomy: [],

    parent_id: parent_ids[parent_ids.length - 1],
    child_ids: [],
    parent_ids: parent_ids,
  };

  // Set photos
  taxa.taxon_photos.forEach((taxonPhoto) => {
    life.photos.push({
      id: uuidv4(),
      storage_path: null,
      original_url: taxonPhoto.photo.original_url ?? null,
      attribution: taxonPhoto.photo.attribution ?? null,
    });
  });

  // Set only 1 photo for group
  if (life.type === "group" && life.photos.length > 0) {
    life.photos = life.photos.slice(0, 1);
  }

  // Set taxonomy
  life.taxonomy = taxa.ancestors.map((taxa) => {
    return {
      id: taxa.id.toString(),
      rank: taxa.rank ?? null,
      scientific_name: taxa.name ?? null,
      french_common_name: taxa.preferred_common_name ?? null,
      english_common_name: taxa.english_common_name ?? null,
    };
  });

  // Optional values
  if (taxa.conservation_status?.status) {
    life.conservation_status = taxa.conservation_status.status.toUpperCase();
  }

  return life;
};
