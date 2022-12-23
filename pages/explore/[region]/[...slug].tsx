import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BottomNavigation from "../../../components/commons/BottomNavigation";
import Header from "../../../components/commons/Header";
import Spinner from "../../../components/commons/Spinner";
import GroupCardGrid from "../../../components/explore/GroupCardGrid";
import SpeciesCard from "../../../components/explore/SpeciesCard";
import { classification } from "../../../constants/classification";
import { speciesList } from "../../../constants/species";
import { ISpecies } from "../../../types/Species";
import { getAllSpecies } from "../../../utils/firestore/species.firestore";
import { searchTreeClassification } from "../../../utils/helper";

const Explore: NextPage = () => {
  const router = useRouter();

  const [species, setSpecies] = useState<ISpecies[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentGroup, setCurrentGroup] = useState<any>();

  useEffect(() => {
    // http://localhost:3000/explore/mediterranean-sea/fauna
    const slug = (router.query.slug as string[]) || []; // ["mediterranean-sea", "fauna"]
    const currentSlug = slug[slug.length - 1]; // "fauna"


    // Group selected
    const group = (
      searchTreeClassification(
        {
          permalink: "...",
          children: classification,
        },
        currentSlug
      )
    );
    console.log(group)
    setCurrentGroup(group);

    // setSpecies([])
    // if (currentGroup?.showSpecies && currentGroup?.id) {
    //   setLoading(true);
    //   getAllSpecies(currentGroup?.id).then((data) => {
    //     setLoading(false);
    //     setSpecies(data);
    //   });
    // }
  }, [router.asPath]);

  return (
    <>
      <Header title={currentGroup?.title?.fr} showBackButton shadow />
      <div className="main-container">
        {loading && currentGroup?.showSpecies && (
          <div className="flex mt-4 w-100">
            <Spinner />
          </div>
        )}
        {!loading && currentGroup?.showSpecies ? (
          <div className="grid">
            {speciesList.map((s) => (
              <div className="col-6" key={s.id}>
                <SpeciesCard species={s} />
              </div>
            ))}
          </div>
        ) : (
          // <DynamicSpeciesListFromAncestorId ancestorId={life.id} />
          <div className="grid">
            {currentGroup?.children?.map((group: any) => (
              <div className="col-6" key={group.permalink}>
                <GroupCardGrid group={group} />
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNavigation />
    </>
  );
};

export default Explore;
