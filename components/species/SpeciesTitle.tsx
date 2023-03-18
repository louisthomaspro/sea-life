import styled from "styled-components";
import { ISpecies } from "../../types/Species";

// svg
import FrFlagSvg from "../../public/icons/flags/FR.svg";
import GbFlagSvg from "../../public/icons/flags/GB.svg";
import { capitalizeFirstLetter, capitalizeWords } from "../../utils/helper";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { useEffect } from "react";

export default function SpeciesTitle(props: { species: ISpecies }) {
  useEffect(() => {
    if (props.species.common_names.fr.length > 1) {
      tippy("#commonNamesFr", {
        allowHTML: true,
        trigger: "click",
        content: capitalizeWords(props.species.common_names.fr.join("<br/>")),
      });
    }
    if (props.species.common_names.en.length > 1) {
      tippy("#commonNamesEn", {
        allowHTML: true,
        trigger: "click",
        content: capitalizeWords(props.species.common_names.en.join("<br/>")),
      });
    }
  }, []);

  return (
    <Style>
      {props.species.common_names?.fr?.length > 0 && (
        <div className="title">
          <div>
            <FrFlagSvg width="16px" />
          </div>
          <span className="ml-2">
            {capitalizeWords(props.species.common_names.fr[0])}
          </span>
          {props.species.common_names.fr.length > 1 && (
            <span className="other-names" id="commonNamesFr">
              +{props.species.common_names.fr.length - 1}
            </span>
          )}
        </div>
      )}
      {props.species.common_names?.en?.length > 0 && (
        <div className="title">
          <div>
            <GbFlagSvg width="16px" />
          </div>
          <span className="ml-2">
            {capitalizeWords(props.species.common_names.en[0])}
          </span>
          {props.species.common_names.en.length > 1 && (
            <span className="other-names" id="commonNamesEn">
              +{props.species.common_names.en.length - 1}
            </span>
          )}
        </div>
      )}
      <div className="scientific-name">
        {capitalizeFirstLetter(props.species.scientific_name)}
      </div>
    </Style>
  );
}

// Style
const Style = styled.div`
  padding: 0px 6px;
  margin-bottom: 16px;
  margin-top: 12px;

  .title {
    font-size: 20px;
    font-weight: bold;
    display: flex;
    align-items: center;

    > span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .other-names {
      display: table;
      font-size: 14px;
      color: var(--text-color-2);
      font-weight: 400;
      padding: 1px 6px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      margin-left: 10px;
    }
  }

  .scientific-name {
    font-size: 16px;
    font-style: italic;
    color: var(--text-color-2);
  }
`;
