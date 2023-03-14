import { DocumentReference } from "firebase/firestore/lite";

export interface IContribution {
  species: DocumentReference,
  user: DocumentReference,
  timestamp: string,
  field: string,
  newValue: string,
  comment: string,
  status?: string,
}

export interface IContributionForm {
  userId: string;
  speciesId: string;
  field: string;
  newValue: string;
  comment: string;
}