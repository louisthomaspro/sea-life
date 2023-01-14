import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useInView } from "react-cool-inview";
import styled from "styled-components";
import BottomNavigation from "../../../components/commons/BottomNavigation";
import BackButton from "../../../components/commons/BackButton";
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
import ScrollHeader from "../../../components/commons/ScrollHeader";

interface IExploreProps {
  currentGroup: IGroup;
  childrenGroups: IGroup[];
  speciesList: ISpecies[];
}
const Explore: NextPage<IExploreProps> = (props) => {
  const router = useRouter();
  const region = router.query.region as string;
  const isFirstLevelGroup = router.query.groups?.length === 1;

  const { inView } = useInView({
    rootMargin: "40px 0px",
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ScrollHeader title={props.currentGroup?.title?.fr} />
      <BottomNavigation />
      <Style className="bottom-navigation max-width-800 global-padding">
        {/* <Scrollbar> */}

        <BackButton className="pt-2" />
        <div className="header">
          <div className="content">
            <div className="title">{props.currentGroup?.title?.fr}</div>
            <div className="region-info">{regionsDict[region].name.fr}</div>
          </div>
        </div>

        <div className="sm:p-0" style={{ maxWidth: "800px", margin: "auto" }}>
          {props.currentGroup?.show_species ? (
            <div className="grid">
              {props.speciesList &&
                props.speciesList.map((s) => (
                  <div className="col-6 sm:col-3" key={s.id}>
                    <SpeciesCard species={s} />
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid">
              {props.childrenGroups?.map((group: IGroup) =>
                isFirstLevelGroup ? (
                  <div className="col-6 sm:col-4" key={group.id}>
                    <div className="sm:p-2">
                      <GroupCardGrid group={group} />
                    </div>
                  </div>
                ) : (
                  <div className="col-12 sm:col-3" key={group.id}>
                    <div className="sm:p-2">
                      <GroupListItem group={group} />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
        {/* </Scrollbar> */}
      </Style>
    </>
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
    margin-bottom: 1rem;

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
