import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import BottomNavigation from "../../../components/commons/BottomNavigation";
import Header from "../../../components/commons/Header";
import GroupCardGrid from "../../../components/explore/GroupCardGrid";
import SpeciesCard from "../../../components/explore/SpeciesCard";
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

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <Scrollbar> */}
      <Header title={currentGroup?.title?.fr} showBackButton shadow fixed />
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
              <div className="col-6" key={group.id}>
                <GroupCardGrid group={group} />
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNavigation />
      {/* </Scrollbar> */}
    </>
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
