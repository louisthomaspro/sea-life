import styled from "styled-components";
import { ISpecies } from "../../types/Species";

// svg
import HouseBlankSvg from "../../public/icons/fontawesome/light/house-blank.svg";
import EarthAmericasSvg from "../../public/icons/fontawesome/light/earth-americas.svg";
import ShieldExclamationSvg from "../../public/icons/fontawesome/light/shield-exclamation.svg";
import { conservation_status_dict } from "../../constants/conservation_status_dict";
import { regions_dict } from "../../constants/regions_dict";
import { biotopes_dict } from "../../constants/biotopes_dict";

export default function SpeciesEnvironment(props: { species: ISpecies }) {
  const conservation_status = props.species.conservation_status;
  const regions = props.species.regions;
  const biotopes = props.species.biotopes;

  // format regions
  let formatted_regions_list = [];
  for (const i in regions) {
    if (regions[i] in regions_dict) {
      formatted_regions_list.push(regions_dict[regions[i]].title.fr);
    }
  }
  const formatted_regions = formatted_regions_list.join(", ");

  // format biotopes
  let formatted_biotopes_list = [];
  for (const i in biotopes) {
    if (biotopes[i] in biotopes_dict) {
      formatted_biotopes_list.push(biotopes_dict[biotopes[i]].title.fr);
    }
  }
  const formatted_biotopes = formatted_biotopes_list.join(", ");

  return (
    <Style>
      <ul>
        {formatted_biotopes && (
          <li className="item">
            <div className="svg-container">
              <HouseBlankSvg
                aria-label="habitat"
                className="svg-icon"
                style={{ width: "26px" }}
              />
            </div>
            <div className="text">Récif, pleine mer</div>
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
                  <a href="https://www.iucnredlist.org/" className="iucn-link">
                    IUCN Red List
                  </a>
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
