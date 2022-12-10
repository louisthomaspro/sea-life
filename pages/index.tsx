import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Configure, InstantSearch } from "react-instantsearch-hooks-web";
import styled from "styled-components";
// import { algolia, algoliaIndex } from "../algolia/clientApp";
import CustomInfiniteHits from "../components/search/CustomInfiniteHits";
import CustomSearchBox from "../components/search/CustomSearchBox";
import Header from "../components/commons/Header";
import SeaTurtleImage from "../public/img/categories/sea-turtle.png";
import PosidoniaImage from "../public/img/categories/posidonia.png";
import Button from "../components/commons/Button";
import SlidersHSvg from "../public/icons/primeicons/sliders-h.svg";
import dynamic from "next/dynamic";
import Link from "next/link";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../constants/config";

const DynamicFilterSideBar = dynamic(
  () => import("../components/search/FilterSideBar")
);

const Home: NextPage<{
  nbHitsFauna: number;
  nbHitsFlora: number;
}> = ({ nbHitsFauna, nbHitsFlora }) => {
  const [algoliaFilter, setAlgoliaFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    let filter = "type:species";
    if (categoryFilter) {
      filter += " AND parent_ids:" + categoryFilter;
    }
    setAlgoliaFilter(filter);
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
      <DynamicFilterSideBar
        visible={filterVisible}
        position="bottom"
        onHide={() => setFilterVisible(false)}
        showCloseIcon={false}
      />

      <Style>
        <Header title="Sea Life" showProfileButton />
        <div className="mt-2 mb-2"></div>

        <div className="main-container">
          
        </div>
      </Style>
    </>
  );
};
export default Home;

// Style
const Style = styled.div`
  width: 100%;

  .category {
    &.fauna {
      background: linear-gradient(290.64deg, #e9eef1 0%, #b3d3e6 98.25%);
      color: var(--primary-color);
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
