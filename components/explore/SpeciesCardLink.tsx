import Link from "next/link";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import { ISpecies } from "../../types/Species";
import SpeciesCard from "./SpeciesCard";

export default function SpeciesCardLink(props: {
  species: ISpecies;
  noLink?: boolean;
}) {
  return (
    <m.div
      whileTap={{
        scale: tapAnimationDuration,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      <Link href={`/species/${props.species.id}`}>
        <SpeciesCard species={props.species} />
      </Link>
    </m.div>
  );
}
