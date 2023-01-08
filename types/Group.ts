import { ISpeciesPhoto } from "./Species";

export interface IGroup {
  id: string;
  title: {
    [lang: string]: string;
  };
  subtitle?: {
    [lang: string]: string;
  };
  photos?: ISpeciesPhoto[];
  includes: string[];
  show_species?: boolean;
  species_count?: {
    [region: string]: number;
  };
  parent_id?: string;
  url?: string;
}
