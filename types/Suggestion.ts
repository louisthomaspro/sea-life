import { DocumentReference } from "firebase/firestore/lite";

export interface ISuggestion {
  species: DocumentReference,
  user: DocumentReference,
  timestamp: string,
  field: string,
  newValue: string,
  comment: string,
  status?: string,
}

export interface ISuggestionForm {
  userId: string;
  speciesId: string;
  field: string;
  newValue: string;
  comment: string;
}