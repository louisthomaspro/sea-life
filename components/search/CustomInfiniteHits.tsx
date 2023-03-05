import React from "react";
import {
  useHits,
  UseInfiniteHitsProps,
  useInstantSearch,
} from "react-instantsearch-hooks-web";
import SpeciesCard from "../explore/SpeciesCard";

export default function CustomInfiniteHits(props: UseInfiniteHitsProps) {
  const { hits, results, sendEvent } = useHits(props);
  const { status } = useInstantSearch();

  return (
    <>
      {status !== "loading" && status !== "stalled" && (
        <div className="grid">
          {hits.map((s: any, index) => (
            <div className="col-6 sm:col-3" key={s.id}>
              <SpeciesCard species={s} index={index} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
