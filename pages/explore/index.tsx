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
import { useContext, useState } from "react";
import RegionContext from "../../context/region.context";
import { getGroup } from "../../utils/firestore/group.firestore";
import { IGroup } from "../../types/Group";
import CustomSearchBox from "../../components/search/CustomSearchBox";

const Explore: NextPage<{
  faunaGroup: IGroup;
  floraGroup: IGroup;
}> = ({ faunaGroup, floraGroup }) => {
  const { userRegion } = useContext(RegionContext);

  return (
    <Style>
      <div className="main-container max-width-500">
        <div className="header">
          <div className="content">
            <div className="title">Explore</div>
          </div>
        </div>
        <div className="sm:hidden my-3">
          <CustomSearchBox />
        </div>
        <RegionDropdown />
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

  .header {
    position: relative;
    margin-top: 30px;

    .content {
      text-align: center;
      padding-bottom: 14px;

      .title {
        font-size: 2rem;
      }
    }
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
