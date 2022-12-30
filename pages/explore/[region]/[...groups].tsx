import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useInView } from "react-cool-inview";
import styled from "styled-components";
import BackButton from "../../../components/commons/BackButton";
import BottomNavigation from "../../../components/commons/BottomNavigation";
import Header from "../../../components/commons/Header";
import GroupCardGrid from "../../../components/explore/GroupCardGrid";
import GroupListItem from "../../../components/explore/GroupListItem";
import SpeciesCard from "../../../components/explore/SpeciesCard";
import { regionsDict } from "../../../constants/regions";
import RegionContext from "../../../context/region.context";
import { IGroup } from "../../../types/Group";
import { ISpecies } from "../../../types/Species";
import {
  getChildrenGroups,
  getGroup,
} from "../../../utils/firestore/group.firestore";
import {
  getAllSpecies,
  getAllSpeciesByGroupList,
} from "../../../utils/firestore/species.firestore";

const Explore: NextPage<{
  currentGroup: IGroup;
  childrenGroups: IGroup[];
  speciesList: ISpecies[];
}> = ({ currentGroup, childrenGroups, speciesList }) => {
  const router = useRouter();
  const region = router.query.region as string;
  const isFirstLevelGroup = router.query.groups?.length === 1;

  const [showSecondHeader, setShowSecondHeader] = useState(false);
  const { observe, unobserve, inView, scrollDirection, entry } = useInView({
    rootMargin: "20px 0px",
    onEnter: ({ scrollDirection, entry, observe, unobserve }) => {
      setShowSecondHeader(false);
    },
    onLeave: ({ scrollDirection, entry, observe, unobserve }) => {
      setShowSecondHeader(true);
    },
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Style>
      {/* <Scrollbar> */}
      <div className="header">
        <div className="back-button" ref={observe}>
          <Header showBackButton noBackground />
        </div>
        <div className="content">
          <div className="title">{currentGroup?.title?.fr}</div>
          <div className="region-info">{regionsDict[region].title.fr}</div>
        </div>
      </div>
      {showSecondHeader && (
        <Header title={currentGroup?.title?.fr} showBackButton fixed />
      )}

      <div className="main-container">
        {currentGroup?.show_species ? (
          <div className="grid">
            {speciesList &&
              speciesList.map((s) => (
                <div className="col-6" key={s.id}>
                  <SpeciesCard species={s} />
                </div>
              ))}
          </div>
        ) : (
          <div className="grid">
            {childrenGroups?.map((group: any) => (
              <>
                {isFirstLevelGroup ? (
                  <div className="col-6" key={group.id}>
                    <GroupCardGrid group={group} />
                  </div>
                ) : (
                  <div className="col-12" key={group.id}>
                    <GroupListItem group={group} />
                  </div>
                )}
              </>
            ))}
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

  const currentGroup: IGroup = JSON.parse(JSON.stringify(await getGroup(id)));

  let childrenGroups: IGroup[] = JSON.parse(
    JSON.stringify(await getChildrenGroups(currentGroup?.id))
  );
  childrenGroups = childrenGroups.filter(
    (group) => group.species_count?.[region as string] > 0
  );

  let speciesList: any[] = null;
  if (currentGroup?.show_species) {
    let speciesListAllProperties = await getAllSpeciesByGroupList(
      currentGroup.includes
    );
    speciesList = speciesListAllProperties.map(
      ({ id, scientific_name, common_name, regions, photos }) => ({
        id,
        scientific_name,
        common_name,
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
      props: { currentGroup, childrenGroups, speciesList, key: groups },
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
    fallback: true,
  };
};

export default Explore;

// Style
const Style = styled.div`
  position: relative;
  margin-top: -60px;

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
