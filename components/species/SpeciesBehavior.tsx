import styled from "styled-components";
import { ISpecies } from "../../types/Species";

// svg
import SociabilitySvg from "../../public/icons/custom/sociability.svg";
import { sociability_dict } from "../../constants/sociability_dict";
import SpeciesInfoItem from "./SpeciesInfoItem";
import Section from "../commons/Section";

export default function SpeciesBehavior(props: {
  species: ISpecies;
  className?: string;
}) {
  const sociability_formatted = sociability_dict[props.species.sociability]?.fr;

  if (!sociability_formatted) {
    return null;
  }

  return (
    <Style className={`${props.className}`}>
      <Section title="MODE DE VIE ET COMPORTEMENT">
        <ul>
          {sociability_formatted && (
            <SpeciesInfoItem
              icon={
                <SociabilitySvg
                  aria-label="sociability"
                  className="svg-icon"
                  style={{ width: "26px" }}
                />
              }
              title={sociability_formatted}
            />
          )}
        </ul>
      </Section>
    </Style>
  );
}

// Style
const Style = styled.div``;
