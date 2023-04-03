import React from "react";
import {
  useHits,
  UseInfiniteHitsProps,
  useInstantSearch,
} from "react-instantsearch-hooks-web";
import SpeciesCard from "../explore/SpeciesCard";
import SpeciesCardLink from "../explore/SpeciesCardLink";

export default function CustomInfiniteHits(props: UseInfiniteHitsProps) {
  const { hits, results, sendEvent } = useHits(props);
  const { status } = useInstantSearch();

  return (
    <>
      {status !== "loading" && status !== "stalled" && (
        <div className="grid">
          {hits.map((s: any, index) => (
            <div className="col-6 sm:col-3" key={s.id}>
              <SpeciesCardLink species={s} />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
