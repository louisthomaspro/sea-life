import styled from "styled-components";
import { ISpecies } from "../../types/Species";

// svg
import SociabilitySvg from "../../public/icons/custom/sociability.svg";
import { sociability_dict } from "../../constants/sociability_dict";

export default function SpeciesBehavior(props: { species: ISpecies }) {
  const sociability_formatted = sociability_dict[props.species.sociability]?.fr

  return (
    <Style>
      <ul>
        {sociability_formatted && (
          <li className="item">
            <div className="svg-container">
            <SociabilitySvg
                aria-label="sociability"
                className="svg-icon"
                style={{ width: "26px" }}
              />
            </div>
            <div className="text">{sociability_formatted}</div>
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
