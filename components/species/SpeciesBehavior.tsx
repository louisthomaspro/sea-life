import styled from "styled-components";
import { ISpecies } from "../../types/Species";

// svg
import SociabilitySvg from "../../public/icons/custom/sociability.svg";
import { sociability_dict } from "../../constants/sociability_dict";
import SpeciesInfoItem from "./SpeciesInfoItem";

export default function SpeciesBehavior(props: { species: ISpecies }) {
  const sociability_formatted = sociability_dict[props.species.sociability]?.fr;

  return (
    <Style>
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
    </Style>
  );
}

// Style
const Style = styled.div``;
