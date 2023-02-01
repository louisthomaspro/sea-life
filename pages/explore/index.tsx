import { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import FaunaBackground from "../../public/img/categories/fauna.jpg";
import FloraBackground from "../../public/img/categories/flora.jpg";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import styled from "styled-components";
import RegionDropdown from "../../components/commons/RegionDropdown";
import { useContext } from "react";
import RegionContext from "../../context/region.context";
import { getGroup } from "../../utils/firestore/group.firestore";
import { IGroup } from "../../types/Group";
import dynamic from "next/dynamic";
import BottomNavigation from "../../components/commons/BottomNavigation";
import NewspaperSvg from "../../public/icons/fontawesome/light/newspaper.svg";
import Head from "next/head";

const DynamicCustomSearchBox = dynamic(
  () => import("../../components/search/CustomSearchBox")
);

const DynamicFacebookPagePosts = dynamic(
  () => import("../../components/socials/FacebookPagePosts")
);

export const Explore: NextPage<{
  faunaGroup: IGroup;
  floraGroup: IGroup;
}> = ({ faunaGroup, floraGroup }) => {
  const { userRegion } = useContext(RegionContext);

  return (
    <>
      <BottomNavigation />

      <Style className="bottom-navigation">
        <HeaderSection className="global-padding">
          <div className="container pt-6 sm:text-center">
            <div className="title pb-3">Sea Life</div>
            <div className="subtitle pb-4 sm:pb-6">
              Découvrez les merveilles de la vie marine
            </div>
            <DynamicCustomSearchBox
              screen="mobile"
              className="sm:hidden pb-4"
            />
          </div>
        </HeaderSection>
        <RegionDropdown className="mb-4  sm:mb-5" />
        <div className="global-padding max-width-500">
          <div className="grid">
            <div className="col-6">
              <CategoryBox
                whileTap={{
                  scale: tapAnimationDuration,
                  transition: { duration: 0.1, ease: "easeInOut" },
                }}
              >
                <Link href={`explore/${userRegion}/fauna`}>
                  <div className="content">
                    <div className="title">Faune</div>
                    <div className="subtitle">
                      {faunaGroup.species_count?.[userRegion]} espèces
                    </div>
                  </div>
                  <div className="img-wrapper">
                    <Image
                      unoptimized={
                        process.env.NEXT_PUBLIC_SKIP_IMAGE_OPTIMIZATION ===
                        "true"
                      }
                      priority
                      src={FaunaBackground}
                      alt="Sea Turtle"
                    />
                  </div>
                </Link>
              </CategoryBox>
            </div>
            <div className="col-6">
              <CategoryBox
                whileTap={{
                  scale: tapAnimationDuration,
                  transition: { duration: 0.1, ease: "easeInOut" },
                }}
              >
                <Link href={`explore/${userRegion}/flora`}>
                  <div className="content">
                    <div className="title">Flore</div>
                    <div className="subtitle">
                      {floraGroup.species_count?.[userRegion]} espèces
                    </div>
                  </div>
                  <div className="img-wrapper">
                    <Image
                      unoptimized={
                        process.env.NEXT_PUBLIC_SKIP_IMAGE_OPTIMIZATION ===
                        "true"
                      }
                      priority
                      src={FloraBackground}
                      alt="Posidonia"
                    />
                  </div>
                </Link>
              </CategoryBox>
            </div>
          </div>
          {/** End of grid */}
          <Section>
            <div className="title">
              Actualités marines
              <NewspaperSvg
                aria-label="newspaper"
                className="svg-icon ml-2"
                style={{ width: "16px", marginLeft: "1px" }}
              />
            </div>
            <DynamicFacebookPagePosts />
          </Section>
        </div>
      </Style>
    </>
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
const Style = styled.div``;

const Section = styled.div`
  padding: 18px 0;

  > .title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    display: flex;
  }
`;

const HeaderSection = styled.div`
  background: linear-gradient(301.08deg, #317074 6.63%, #034c82 82.39%);

  > .container {
    > .title {
      font-size: 1.8rem;
      font-weight: 600;
      color: white;
    }

    > .subtitle {
      font-size: 1.2rem;
      font-weight: 400;
      color: white;
    }
  }
`;

const CategoryBox = styled(m.div)`
  border-radius: var(--border-radius);
  width: 100%;
  display: flex;
  aspect-ratio: 1;
  overflow: hidden;

  > a {
    position: relative;
    width: 100%;

    > .img-wrapper {
      position: absolute;
      top: 0;
      z-index: 1;

      img {
        object-fit: contain;
        height: 100%;
      }
    }

    > .content {
      position: relative;
      z-index: 2;
      padding: 20px;
      min-width: 150px;
      color: white;

      .title {
        font-size: 1.8rem;
        font-weight: 600;
        letter-spacing: 0.015em;
      }
    }
  }
`;
