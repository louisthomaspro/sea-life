import { useEffect, useRef, useState } from "react";
import { useInView } from "react-cool-inview";
import { algoliaIndex } from "../../algolia/clientApp";
import { ILife } from "../../types/Life";
import Spinner from "../commons/Spinner";
import SpeciesCard from "./SpeciesCard";
import { m, useAnimation } from "framer-motion";

const speciesAnimationVariants = {
  visible: { y: 0, opacity: 1, transition: { duration: 0.2 } },
  hidden: { y: 10, opacity: 0 },
};

export function SpeciesCardAnimated(props: { life: ILife }) {
  const controls = useAnimation();
  const { observe } = useInView({
    delay: 100,
    onEnter: () => {
      controls.start("visible");
    },
    onLeave: () => {
      controls.start("hidden");
    },
  });

  return (
    <m.div
      ref={observe}
      animate={controls}
      initial="hidden"
      variants={speciesAnimationVariants}
      className="square"
    >
      <SpeciesCard life={props.life} />
    </m.div>
  );
}

export default function SpeciesListFromAncestorId(props: {
  ancestorId: string;
}) {
  const [species, setSpecies] = useState<ILife[]>([]);
  const [loading, setLoading] = useState(true);

  const [currPage, setCurrPage] = useState({ index: 0, id: "" });
  const [lastList, setLastList] = useState(false);

  const prevAncestorId = useRef<string>(null);

  useEffect(() => {
    if (prevAncestorId.current !== props.ancestorId) {
      prevAncestorId.current = props.ancestorId;
      setSpecies([]);
      setLastList(false);
      setCurrPage({ index: 0, id: props.ancestorId });
      return;
    } else {
      // console.warn("new page ", currPage);
    }

    const fetchData = async () => {
      if (!currPage.id) return;
      setLoading(true);
      algoliaIndex
        .search("", {
          facetFilters: ["type:species", `parent_ids:${props.ancestorId}`],
          page: currPage.index,
          hitsPerPage: 20,
        })
        .then((res) => {
          if (res.nbPages === res.page + 1) {
            setLastList(true);
          }
          if (res.page === 0) {
            setSpecies(res.hits as any);
          } else {
            setSpecies([...species, ...(res.hits as any)]);
          }
          setLoading(false);
        });
    };

    if (!lastList) {
      fetchData();
    }
  }, [props.ancestorId, currPage]);

  const { observe } = useInView({
    delay: 100,
    onEnter: () => {
      if (!lastList && !loading) {
        setCurrPage({ index: currPage.index + 1, id: currPage.id });
      }
    },
  });

  return (
    <div className="mb-3">
      <div
        className="grid pb-3 grid-nogutter"
        style={{ marginRight: "-0.25rem", marginLeft: "-0.25rem" }}
      >
        {species?.map((life: any) => (
          <div className="col-6 p-1 mb-2" key={life.id}>
            <SpeciesCardAnimated life={life} />
          </div>
        ))}
      </div>
      {!lastList && (
        <div className="flex pb-3">
          <Spinner />
        </div>
      )}
      <div
        ref={observe}
        style={{
          height: "50px",
          width: "100px",
          // background: "red",
          position: "absolute",
          bottom: "500px",
          zIndex: "-10",
        }}
      ></div>
    </div>
  );
}
