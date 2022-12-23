import { ISpeciesPhoto } from "./Species";

export interface IClassItem {
  id: string;
  title: {
    [lang: string]: string;
  };
  subtitle?: {
    [lang: string]: string;
  };
  photos?: {
    [region: string]: ISpeciesPhoto;
  }
  permalink: string;
  children?: IClassItem[];
  show_species?: boolean;
  species_count?: {
    [region: string]: number;
  }
  parent_id?: string;
}
