import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import BottomNavigation from "../../components/commons/BottomNavigation";
import Header from "../../components/commons/Header";
import SeaTurtleImage from "../../public/img/categories/sea-turtle.png";
import PosidoniaImage from "../../public/img/categories/posidonia.png";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import styled from "styled-components";
import RegionDropdown from "../../components/commons/RegionDropdown";
import { useContext, useEffect, useState } from "react";
import RegionContext from "../../context/region.context";
import { getGroup } from "../../utils/firestore/group.firestore";
import { IGroup } from "../../types/Group";
import { useRouter } from "next/router";
import { Configure, InstantSearch } from "react-instantsearch-hooks-web";
import CustomSearchBox from "../../components/search/CustomSearchBox";
import CustomInfiniteHits from "../../components/search/CustomInfiniteHits";
import { algolia } from "../../algolia/clientApp";

const Explore: NextPage<{
  faunaGroup: IGroup;
  floraGroup: IGroup;
}> = ({ faunaGroup, floraGroup }) => {
  const { userRegion } = useContext(RegionContext);

  const [algoliaFilter, setAlgoliaFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    // let filter = "type:species";
    // if (categoryFilter) {
    //   filter += " AND parent_ids:" + categoryFilter;
    // }
    // setAlgoliaFilter(filter);
  }, [categoryFilter]);

  const handleQueryHook = (query: string, search: (value: string) => void) => {
    if (query !== "") {
      setShowSearchResults(true);
      setTimeout(() => {
        // Fix "first search" query bug
        search(query);
      }, 1);
    } else {
      setShowSearchResults(false);
    }
  };

  return (
    <>
      <Header title="Explore" fixed />
      <div className="main-container">
        <InstantSearch indexName="species" searchClient={algolia}>
          <Configure filters={algoliaFilter} />
          {/* Search */}
          <CustomSearchBox queryHook={handleQueryHook} />

          <hr />
          {showSearchResults ? <CustomInfiniteHits /> : <></>}
        </InstantSearch>

        <Style>
          {!showSearchResults && (
            <>
              {/* <RegionDropdown /> */}
              <m.div
                whileTap={{
                  scale: tapAnimationDuration,
                  transition: { duration: 0.1, ease: "easeInOut" },
                }}
              >
                {/* Categories */}
                <Link href={`explore/${userRegion}/fauna`}>
                  <div className="category fauna">
                    <div className="content">
                      <div className="title">Faune</div>
                      <div className="subtitle">
                        {faunaGroup.species_count?.[userRegion]} espèces
                      </div>
                    </div>
                    <div className="align-self-center text-center">
                      <Image
                        src={SeaTurtleImage}
                        alt="Sea Turtle"
                        width={200}
                        height={90}
                      />
                    </div>
                  </div>
                </Link>
              </m.div>

              <m.div
                whileTap={{
                  scale: tapAnimationDuration,
                  transition: { duration: 0.1, ease: "easeInOut" },
                }}
              >
                <Link href={`explore/${userRegion}/flora`}>
                  <div className="category flora">
                    <div className="content">
                      <div className="title">Flore</div>
                      <div className="subtitle">
                        {floraGroup.species_count?.[userRegion]} espèces
                      </div>
                    </div>
                    <div className="align-self-center text-center">
                      <Image
                        src={PosidoniaImage}
                        alt="Posidonia"
                        width={200}
                        height={120}
                      />
                    </div>
                  </div>
                </Link>
              </m.div>
            </>
          )}
        </Style>
      </div>
      <BottomNavigation />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const faunaGroup: IGroup = JSON.parse(
    JSON.stringify(await getGroup("fauna"))
  );

  const floraGroup: IGroup = JSON.parse(
    JSON.stringify(await getGroup("flora"))
  );

  if (faunaGroup && floraGroup) {
    return {
      props: { faunaGroup, floraGroup },
    };
  } else {
    return { notFound: true };
  }
};

export default Explore;

// Style
const Style = styled.div`
  width: 100%;

  .category {
    &.fauna {
      background: linear-gradient(290.64deg, #e9eef1 0%, #b3d3e6 98.25%);
      color: var(--blue);
    }
    &.flora {
      background: linear-gradient(290.64deg, #f3f3f3 0%, #d9edd4 98.25%);
      color: var(--green);
    }

    border-radius: var(--border-radius);
    width: 100%;
    height: 150px;
    display: flex;
    align-items: flex-end;
    margin-bottom: 1rem;

    .content {
      padding: 22px;
      min-width: 150px;

      .title {
        font-size: 32px;
        font-weight: bold;
      }
    }
  }
`;
