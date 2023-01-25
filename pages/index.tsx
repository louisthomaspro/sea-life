import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import SeaTurtleImage from "../public/img/categories/sea-turtle.png";
import PosidoniaImage from "../public/img/categories/posidonia.png";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../constants/config";
import styled from "styled-components";
import RegionDropdown from "../components/commons/RegionDropdown";
import { useContext } from "react";
import RegionContext from "../context/region.context";
import { getGroup } from "../utils/firestore/group.firestore";
import { IGroup } from "../types/Group";
import dynamic from "next/dynamic";

const DynamicCustomSearchBox = dynamic(
  () => import("../components/search/CustomSearchBox")
);

export const Explore: NextPage<{
  faunaGroup: IGroup;
  floraGroup: IGroup;
}> = ({ faunaGroup, floraGroup }) => {
  const { userRegion } = useContext(RegionContext);

  return (
    <Style>
      <div className="global-padding max-width-500">
        <div className="explore-header mt-5 mb-4">Explore</div>
        <DynamicCustomSearchBox screen="mobile" className="sm:hidden my-3" />
        <RegionDropdown className="mb-4" />

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
              <div className="img-wrapper">
                <Image
                  unoptimized={
                    process.env.NEXT_PUBLIC_SKIP_IMAGE_OPTIMIZATION === "true"
                  }
                  priority
                  src={SeaTurtleImage}
                  alt="Sea Turtle"
                  style={{ objectFit: "contain", maxHeight: "100px" }}
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
              <div className="img-wrapper">
                <Image
                  unoptimized={
                    process.env.NEXT_PUBLIC_SKIP_IMAGE_OPTIMIZATION === "true"
                  }
                  src={PosidoniaImage}
                  alt="Posidonia"
                  style={{ objectFit: "contain", maxHeight: "120px" }}
                />
              </div>
            </div>
          </Link>
        </m.div>
      </div>
    </Style>
  );
};
export default Explore;

export const getStaticProps: GetStaticProps = async (context) => {
  const [faunaGroup, floraGroup] = await Promise.all([
    getGroup("fauna"),
    getGroup("flora"),
  ]);

  return {
    props: { faunaGroup, floraGroup },
  };
};

// Style
const Style = styled.div`
  .explore-header {
    text-align: center;
    font-size: 2rem;
  }

  .img-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
  }

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
