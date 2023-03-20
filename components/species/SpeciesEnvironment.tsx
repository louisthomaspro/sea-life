import styled from "styled-components";
import { ISpecies } from "../../types/Species";

// svg
import HouseBlankSvg from "../../public/icons/fontawesome/light/house-blank.svg";
import EarthAmericasSvg from "../../public/icons/fontawesome/light/earth-americas.svg";
import ShieldExclamationSvg from "../../public/icons/fontawesome/light/shield-exclamation.svg";
import { conservation_status_dict } from "../../constants/conservation_status_dict";
import { regionsDict } from "../../constants/regions";
import Link from "next/link";
import SpeciesInfoItem from "./SpeciesInfoItem";
import { habitatsDict } from "../../constants/habitats";

export default function SpeciesEnvironment(props: { species: ISpecies }) {
  const conservation_status = props.species.conservation_status;
  const regions = props.species.regions;
  const habitats_1 = props.species.habitats_1 ?? [];
  const habitats_2 = props.species.habitats_2 ?? [];

  // format regions
  let formatted_regions_list = [];
  for (const i in regions) {
    if (regions[i] in regionsDict) {
      formatted_regions_list.push(regionsDict[regions[i]].name.fr);
    }
  }
  const formatted_regions = formatted_regions_list.join(", ");

  // format habitats_1
  const formatted_habitats_1 = habitats_1
    .filter((habitat) => habitat in habitatsDict)
    .map((habitat) => habitatsDict[habitat].title.fr)
    .join(", ");

  // format habitats_2
  const formatted_habitats_2 = habitats_2
    .filter((habitat) => habitat in habitatsDict)
    .map((habitat) => habitatsDict[habitat].title.fr)
    .join(", ");

  return (
    <Style>
      {(formatted_habitats_1 || formatted_habitats_2) && (
        <SpeciesInfoItem
          icon={
            <HouseBlankSvg
              aria-label="habitat"
              className="svg-icon"
              style={{ width: "26px" }}
            />
          }
          title={formatted_habitats_1}
          subtitle={formatted_habitats_2}
        />
      )}

      <SpeciesInfoItem
        icon={
          <EarthAmericasSvg
            aria-label="region"
            className="svg-icon"
            style={{ width: "24px" }}
          />
        }
        title={formatted_regions}
      />
      {conservation_status &&
        conservation_status in conservation_status_dict && (
          <SpeciesInfoItem
            icon={
              <ShieldExclamationSvg
                aria-label="conservation status"
                className="svg-icon"
                style={{ width: "24px" }}
              />
            }
            title={conservation_status_dict[conservation_status].title.fr}
            subtitle={
              <>
                Source:{" "}
                <Link
                  href={`https://apiv3.iucnredlist.org/api/v3/taxonredirect/${props.species.external_ids?.iucn}`}
                  target="_blank"
                  className="underline"
                >
                  IUCN Red List
                </Link>
              </>
            }
            blinkRed={true}
          />
        )}
    </Style>
  );
}

// Style
const Style = styled.div``;
