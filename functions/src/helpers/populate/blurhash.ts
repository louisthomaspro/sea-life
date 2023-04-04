import { ISpecies } from "sea-life/types/Species";
import { getPlaiceholder } from "plaiceholder";

export const populateBlurhashMissing = async (species: ISpecies) => {
  await Promise.all(
    species.photos.map(async (photo: any) => {
      if (!photo.blurhash) {
        const { blurhash } = await getPlaiceholder(photo.original_url, {
          size: 40,
        });
        photo.blurhash = blurhash;
      }
    })
  );

  return species;
};
