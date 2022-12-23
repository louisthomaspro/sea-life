import { cloneDeep } from "lodash";
import styled from "styled-components";
import { ISpecies, ITaxonomy } from "../../types/Species";
import { capitalizeFirstLetter } from "../../utils/helper";

export default function SpeciesTaxonomy(props: { species: ISpecies }) {
  const taxonomyTemplate = (taxonomy: ITaxonomy[]) => {
    if (taxonomy.length === 0) {
      return "";
    }
    const taxa = taxonomy[0];
    taxonomy.shift();
    return (
      <ul>
        <li>
          {taxa.common_name.fr ? (
            capitalizeFirstLetter(taxa.common_name.fr)
          ) : (
            <span className="font-italic">
              {capitalizeFirstLetter(taxa.scientific_name)}
            </span>
          )}{" "}
          ({taxa.rank})
        </li>
        {taxonomyTemplate(taxonomy)}
      </ul>
    );
  };

  return <Style>{taxonomyTemplate(cloneDeep(props.species.taxonomy))}</Style>;
}

// Style
const Style = styled.div`
  ul {
    list-style: none;
    margin-left: 14px;
    font-size: 16px;

    li {
      margin-top: 8px;

      &:before {
        content: "";
        color: #ee3c06;
        background: red;
        width: 8px;
        height: 8px;
        border-radius: 10px;
        display: inline-block;
        margin-left: -1em;
        margin-right: 12px;
      }
    }
  }
`;
