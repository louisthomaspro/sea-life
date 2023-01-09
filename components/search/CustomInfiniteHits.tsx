import React from "react";
import {
  useHits,
  UseInfiniteHitsProps,
} from "react-instantsearch-hooks-web";
import SpeciesCard from "../explore/SpeciesCard";

export default function CustomInfiniteHits(props: UseInfiniteHitsProps) {
  const { hits,  results, sendEvent } = useHits(props);

  return (
    <>
      <div
        className="grid mb-3 grid-nogutter"
        style={{ marginRight: "-0.25rem", marginLeft: "-0.25rem" }}
      >
        {hits?.map((species: any) => (
          <div className="col-6 p-1" key={species.scientific_name}>
            <SpeciesCard species={species} />
          </div>
        ))}
        {hits?.length === 0 && <>Aucune espèce trouvée :(</>}
      </div>
    </>
  );
}
