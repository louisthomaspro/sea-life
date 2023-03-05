import { cloneDeep } from "lodash";
import { useEffect } from "react";
import styled from "styled-components";
import { taxonomyRankDict } from "../../constants/taxonomy_rank_dict";
import { ISpecies, ITaxonomy } from "../../types/Species";
import { getGroupByScientificNameList } from "../../utils/firestore/group.firestore";
import { capitalizeFirstLetter } from "../../utils/helper";

export default function SpeciesTaxonomy(props: { species: ISpecies }) {
  // useEffect(() => {
  //   let linkDict: any = {};
  //   let scientificNameSet = new Set<string>();
  //   props.species.taxonomy.forEach((taxa) => {
  //     scientificNameSet.add(taxa.scientific_name);
  //   });
  //   getGroupByScientificNameList(Array.from(scientificNameSet)).then(
  //     (groups) => {
  //       Array.from(scientificNameSet).forEach((scientificName) => {
  //         groups.forEach((group) => {
  //           if (group.includes.includes(scientificName)) {
  //             linkDict[scientificName] = group.url;
  //           }
  //         });
  //       });
  //       console.log(linkDict)
  //     }
  //   );
  // }, []);

  const taxonomyTemplate = (taxonomy: ITaxonomy[]) => {
    if (taxonomy.length === 0) {
      return "";
    }
    const taxa = taxonomy[0];
    taxonomy.shift();
    return (
      <Taxa>
        <li>
          <div className="name">
            {taxa.common_name.fr
              ? capitalizeFirstLetter(taxa.common_name.fr)
              : capitalizeFirstLetter(taxa.scientific_name)}
          </div>
          {/* Rank */}
          <div className="rank">
            {taxa.rank in taxonomyRankDict
              ? taxonomyRankDict[taxa.rank].fr
              : ""}
          </div>
        </li>
        <li>{taxonomyTemplate(taxonomy)}</li>
      </Taxa>
    );
  };

  return <Style>{taxonomyTemplate(cloneDeep(props.species.taxonomy))}</Style>;
}

// Style
const Style = styled.div``;

const Taxa = styled.ul`
  list-style: none;
  margin-left: 14px;

  > li {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    position: relative;

    > .name {
      font-size: 16px;
      /* font-weight: 500; */
    }

    // Rank
    > .rank {
      font-style: italic;
      font-size: 14px;
    }

    &:first-child:before {
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
`;
