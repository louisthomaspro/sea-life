import { ISpeciesPhoto } from "./Species";

export interface IAnecdote {
  title: string,
  content: string,
  photos?: ISpeciesPhoto[]
  related_ids: string[]
}