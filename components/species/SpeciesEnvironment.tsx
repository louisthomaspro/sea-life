import styled from "styled-components";
import { ISpecies } from "../../types/Species";

// svg
import HouseBlankSvg from "../../public/icons/fontawesome/light/house-blank.svg";
import EarthAmericasSvg from "../../public/icons/fontawesome/light/earth-americas.svg";
import ShieldExclamationSvg from "../../public/icons/fontawesome/light/shield-exclamation.svg";
import { conservation_status_dict } from "../../constants/conservation_status_dict";
import { regionsDict } from "../../constants/regions";
import { habitats_dict } from "../../constants/habitats_dict";
import Link from "next/link";

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
    .filter((habitat) => habitat in habitats_dict)
    .map((habitat) => habitats_dict[habitat].title.fr)
    .join(", ");

  // format habitats_2
  const formatted_habitats_2 = habitats_2
    .filter((habitat) => habitat in habitats_dict)
    .map((habitat) => habitats_dict[habitat].title.fr)
    .join(", ");

  return (
    <Style>
      <ul>
        {(formatted_habitats_1 || formatted_habitats_2) && (
          <li className="item">
            <div className="svg-container">
              <HouseBlankSvg
                aria-label="habitat"
                className="svg-icon"
                style={{ width: "26px" }}
              />
            </div>
            <div className="text">
              <div className="habitat-1">{formatted_habitats_1}</div>
              <div className="habitat-2">{formatted_habitats_2}</div>
            </div>
          </li>
        )}

        <li className="item">
          <div className="svg-container">
            <EarthAmericasSvg
              aria-label="region"
              className="svg-icon"
              style={{ width: "24px" }}
            />
          </div>
          <div className="text">{formatted_regions}</div>
        </li>
        {conservation_status &&
          conservation_status in conservation_status_dict && (
            <li className="item blink-red">
              <div className="svg-container">
                <ShieldExclamationSvg
                  aria-label="conservation status"
                  className="svg-icon"
                  style={{ width: "24px" }}
                />
              </div>
              <div className="text">
                {conservation_status_dict[conservation_status].title.fr}
                <span className="iucn">
                  {" "}
                  (Source:{" "}
                  <Link
                    href={`https://apiv3.iucnredlist.org/api/v3/taxonredirect/${props.species.external_ids?.iucn}`}
                    target="_blank"
                    className="iucn-link"
                  >
                    IUCN Red List
                  </Link>
                  )
                </span>
              </div>
            </li>
          )}
      </ul>
    </Style>
  );
}

// Style
const Style = styled.div`
  .item {
    display: flex;
    align-items: center;
    padding: 5px 0;

    .text {
      font-weight: 600;
      font-size: 14px;
      padding-right: 8px;

      .habitat-1 {
      }
      .habitat-2 {
        font-weight: 400;
      }
    }

    .svg-container {
      width: 40px;
      flex: none;

      .svg-icon {
        display: flex;
      }
    }

    &.blink-red {
      animation: blinkingText 2s infinite ease-in-out;

      .svg-icon path {
        animation: blinkingText 2s infinite ease-in-out;
      }

      @keyframes blinkingText {
        0% {
        }
        50% {
          color: var(--red);
          fill: var(--red);
        }
        100% {
        }
      }
    }
  }

  .iucn {
    font-weight: 400;

    .iucn-link {
      text-decoration: underline;
    }
  }
`;
