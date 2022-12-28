import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import BottomNavigation from "../../../components/commons/BottomNavigation";
import Header from "../../../components/commons/Header";
import Spinner from "../../../components/commons/Spinner";
import GroupCardGrid from "../../../components/explore/GroupCardGrid";
import SpeciesCard from "../../../components/explore/SpeciesCard";
import { classification } from "../../../constants/classification";
import { speciesList } from "../../../constants/species";
import RegionContext from "../../../context/region.context";
import { IGroup } from "../../../types/Group";
import { ISpecies } from "../../../types/Species";
import { Skeleton } from "primereact/skeleton";
import {
  getChildrenGroups,
  getGroupByPermalink,
} from "../../../utils/firestore/group.firestore";
import { getAllSpecies } from "../../../utils/firestore/species.firestore";
import { searchTreeClassification } from "../../../utils/helper";
import Scrollbar from "../../../components/explore/Scrollbar";

const Explore: NextPage<{
  currentGroup: IGroup;
  childrenGroups: IGroup[];
  speciesList: ISpecies[];
}> = ({ currentGroup, childrenGroups, speciesList }) => {
  const router = useRouter();

  const { urlRegion } = useContext(RegionContext);
  const [species, setSpecies] = useState<ISpecies[]>([]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <Scrollbar> */}
      <Header title={currentGroup?.title?.fr} showBackButton shadow />
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
          // <DynamicSpeciesListFromAncestorId ancestorId={life.id} />
          <div className="grid">
            {childrenGroups?.map((group: any) => (
              <div className="col-6" key={group.permalink}>
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
  const { groups } = context.params;

  const id = groups[groups.length - 1];

  const currentGroup: IGroup = JSON.parse(
    JSON.stringify(await getGroupByPermalink(id))
  );

  const childrenGroups: IGroup[] = JSON.parse(
    JSON.stringify(await getChildrenGroups(currentGroup?.id))
  );

  let speciesList: any[] = null;
  if (currentGroup?.show_species) {
    const speciesListAllProperties = await getAllSpecies(currentGroup.id);
    speciesList = speciesListAllProperties.map(
      ({ id, scientific_name, common_name, regions, photos }) => ({
        id,
        scientific_name,
        common_name,
        regions,
        photos: [photos[0]],
      })
    );
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
