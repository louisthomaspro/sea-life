import { cloneDeep } from "lodash";
import styled from "styled-components";
import { taxonomyRankDict } from "../../constants/taxonomy_rank_dict";
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
          <div className="name">
            {taxa.common_name.fr
              ? capitalizeFirstLetter(taxa.common_name.fr)
              : capitalizeFirstLetter(taxa.scientific_name)}
          </div>
          <div className="rank">
            {taxa.rank in taxonomyRankDict
              ? taxonomyRankDict[taxa.rank].fr
              : ""}
          </div>
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

    li {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      position: relative;

      .name {
        font-size: 16px;
        /* font-weight: 500; */
      }

      .rank {
        font-style: italic;
        font-size: 14px;
      }

      &:before {
        content: "";
        top: 7px;
        position: absolute;
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
