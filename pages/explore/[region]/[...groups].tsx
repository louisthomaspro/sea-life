import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useInView } from "react-cool-inview";
import styled from "styled-components";
import BottomNavigation from "../../../components/commons/BottomNavigation";
import Header from "../../../components/commons/Header";
import GroupCardGrid from "../../../components/explore/GroupCardGrid";
import GroupListItem from "../../../components/explore/GroupListItem";
import SpeciesCard from "../../../components/explore/SpeciesCard";
import { regionsDict } from "../../../constants/regions";
import { IGroup } from "../../../types/Group";
import { ISpecies } from "../../../types/Species";
import {
  getChildrenGroups,
  getGroup,
} from "../../../utils/firestore/group.firestore";
import { getAllSpeciesByGroupList } from "../../../utils/firestore/species.firestore";

const Explore: NextPage<{
  currentGroup: IGroup;
  childrenGroups: IGroup[];
  speciesList: ISpecies[];
}> = ({ currentGroup, childrenGroups, speciesList }) => {
  const router = useRouter();
  const region = router.query.region as string;
  const isFirstLevelGroup = router.query.groups?.length === 1;

  const [displaySecondHeader, setDisplaySecondHeader] = useState(false);

  const {
    observe,
    unobserve,
    inView,
  } = useInView({
    rootMargin: "20px 0px",

    onChange: ({ inView }) => {
      setDisplaySecondHeader(!inView);
    },
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Style className="no-header">
      {/* <Scrollbar> */}
      <div className="header">
        <div className="back-button" ref={observe}>
          <Header showBackButton noBackground />
        </div>
        <div className="content">
          <div className="title">{currentGroup?.title?.fr}</div>
          <div className="region-info">{regionsDict[region].name.fr}</div>
        </div>
      </div>
      {displaySecondHeader && (
        <Header title={currentGroup?.title?.fr} showBackButton fixed />
      )}

      <div className="main-container">
        {currentGroup?.show_species ? (
          <div className="grid">
            {speciesList &&
              speciesList.map((s, index) => (
                <div className="col-6" key={s.id}>
                  <SpeciesCard species={s} index={index} />
                </div>
              ))}
          </div>
        ) : (
          <div className="grid">
            {childrenGroups?.map((group: IGroup, index) =>
              isFirstLevelGroup ? (
                <div className="col-6" key={group.id}>
                  <GroupCardGrid group={group} index={index} />
                </div>
              ) : (
                <div className="col-12" key={group.id}>
                  <GroupListItem group={group} index={index} />
                </div>
              )
            )}
          </div>
        )}
      </div>
      <BottomNavigation />
      {/* </Scrollbar> */}
    </Style>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { groups, region } = context.params;
  const id = groups[groups.length - 1];

  // Get currentGroup
  const currentGroup: IGroup = JSON.parse(JSON.stringify(await getGroup(id)));

  // Get childrenGroups
  let childrenGroups: IGroup[] = JSON.parse(
    JSON.stringify(await getChildrenGroups(currentGroup?.id))
  );
  childrenGroups = childrenGroups.filter(
    (group) => group.species_count?.[region as string] > 0
  );

  // Get speciesList
  let speciesList: any[] = [];
  if (currentGroup?.show_species) {
    let speciesListAllProperties = await getAllSpeciesByGroupList(
      currentGroup.includes
    );
    speciesList = speciesListAllProperties.map(
      ({ id, scientific_name, common_names, regions, photos }) => ({
        id,
        scientific_name,
        common_names,
        regions,
        photos: photos[0] ? [photos[0]] : [],
      })
    );

    if (region !== "all") {
      speciesList = speciesList.filter((species) =>
        species.regions.includes(region)
      );
    }
  }

  if (currentGroup) {
    return {
      props: {
        currentGroup,
        childrenGroups,
        speciesList,
        key: groups,
      },
    };
  } else {
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  // const speciesList = await getAllSpecies();
  // const paths = speciesList.map((species) => ({
  //   params: { id: species.id },
  // }));

  return {
    // paths: process.env.SKIP_BUILD_STATIC_GENERATION ? [] : paths,
    paths: [],
    fallback: "blocking",
  };
};

export default Explore;

// Style
const Style = styled.div`
  position: relative;

  .header {
    position: relative;

    .content {
      text-align: center;
      padding-bottom: 14px;

      .title {
        font-size: 2rem;
      }

      .region-info {
        font-weight: 400;
        font-style: italic;
      }
    }
  }
`;
