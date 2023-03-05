import { IGroup } from "./Group";
import { ISpeciesPhoto } from "./Species";

export interface ISpeciesGridInfo {
  [group: string]: {
    groupInfo: IGroup
    numberOfSpecies: number
  };
}
