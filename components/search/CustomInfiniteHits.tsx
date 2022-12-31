import React, { useEffect, useRef, useState } from "react";
import {
  useInfiniteHits,
  UseInfiniteHitsProps,
} from "react-instantsearch-hooks-web";
import { ISpecies } from "../../types/Species";
import SpeciesCard from "../explore/SpeciesCard";

export default function CustomInfiniteHits(props: UseInfiniteHitsProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver>();
  const prevY = useRef(0);
  const { hits, isLastPage, showMore, showPrevious } = useInfiniteHits(props);

  const initObserverForInfiniteScroll = () => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        const y = firstEntry.boundingClientRect.y;

        if (prevY.current > y) {
          showMore();
        }
        prevY.current = y;
      },
      { threshold: 0.5 }
    );

    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver!.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver!.unobserve(currentElement);
      }
    };
  };

  useEffect(() => {
    // initObserverForInfiniteScroll();
  }, [element]);

  return (
    <>
      <div className="grid mb-3 grid-nogutter" style={{ marginRight: "-0.25rem", marginLeft: "-0.25rem" }}>
        {hits?.map((species: any) => (
          <div className="col-6 p-1" key={species.scientific_name}>
            <SpeciesCard species={species} />
          </div>
        ))}
        {/* Skeleton loading */}
        {!isLastPage && (
          <>
            {/* <Grid item ref={setElement} xs={6}>
              <Card>
                <CardActionArea>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Typography component="div">
                      <Skeleton />
                    </Typography>
                    <Typography variant="caption">
                      <Skeleton />
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardActionArea>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Typography component="div">
                      <Skeleton />
                    </Typography>
                    <Typography variant="caption">
                      <Skeleton />
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid> */}
          </>
        )}
      </div>
      {/* {isLastPage && <div>No more sealife available...</div>} */}
    </>
  );
}
