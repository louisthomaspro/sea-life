import "keen-slider/keen-slider.min.css";
import { useContext } from "react";
import styled from "styled-components";
import Section from "../commons/Section";
import Link from "next/link";
import AuthContext from "../../context/auth.context";
import { ISpecies } from "../../types/Species";
import SpeciesHeader from "./SpeciesHeader";
import SpeciesTitle from "./SpeciesTitle";
import SpeciesSlider from "./SpeciesSlider";
import SpeciesTaxonomy from "./SpeciesTaxonomy";
import SpeciesAnecdote from "./SpeciesAnecdote";
import SpeciesHighlight from "./SpeciesHighlight";
import SpeciesEnvironment from "./SpeciesEnvironment";

export default function SpeciesInformation(props: { species: ISpecies }) {
  const { userData } = useContext(AuthContext);

  return (
    <>
      <Style>
        <SpeciesHeader species={props.species} />
        <Link href={`/species/${props.species.id}/gallery`}>
          <SpeciesSlider species={props.species} />
        </Link>
        <div className="main-container pt-0">
          <SpeciesTitle species={props.species} />
          <SpeciesHighlight species={props.species} />
          {/* <SpeciesAnecdote species={props.species} /> */}
          <Section title="ENVRIONNEMENT">
            <SpeciesEnvironment species={props.species} />
          </Section>
          <Section title="MODE DE VIE ET COMPORTEMENT">
            Prochainement...
          </Section>
          <Section title="MORPHOLOGIE">Prochainement...</Section>
          <Section title="TAXONOMIE">
            <SpeciesTaxonomy species={props.species} />
          </Section>
        </div>
      </Style>
    </>
  );
}

// Style
const Style = styled.div`
  padding-bottom: 20px;
`;
