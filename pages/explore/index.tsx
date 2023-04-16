import { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useContext } from "react";
import { getGroup } from "../../utils/firestore/group.firestore";
import { IGroup } from "../../types/Group";
import dynamic from "next/dynamic";
import BottomNavigation from "../../components/commons/BottomNavigation";
import NewspaperSvg from "../../public/icons/fontawesome/light/newspaper.svg";
import { getPlaiceholder, IGetPlaiceholderReturn } from "plaiceholder";
import RegionContext from "../../components/region/region.context";
import CustomSearchBoxSkeleton from "../../components/search/CustomSearchBoxSkeleton";
import RegionDropdownSkeleton from "../../components/region/RegionDropdownSkeleton";

const DynamicCustomSearchBox = dynamic(
  () => import("../../components/search/CustomSearchBox"),
  { loading: () => <CustomSearchBoxSkeleton /> }
);

const DynamicRegionDropdown = dynamic(
  () => import("../../components/region/RegionDropdown"),
  { loading: () => <RegionDropdownSkeleton /> }
);

const DynamicExploreCard = dynamic(
  import("../../components/explore/ExploreCard")
);

const DynamicFacebookPagePosts = dynamic(
  () => import("../../components/socials/FacebookPagePosts"),
  { ssr: false }
);

export const Explore: NextPage<{
  faunaGroup: IGroup;
  floraGroup: IGroup;
  faunaBackgroundPH: IGetPlaiceholderReturn;
  floraBackgroundPH: IGetPlaiceholderReturn;
}> = ({ faunaGroup, floraGroup, faunaBackgroundPH, floraBackgroundPH }) => {
  const { userRegion } = useContext(RegionContext);

  return (
    <>
      <BottomNavigation />
      <div className="pb-7">
        {/* HEADER */}
        <div
          className="global-padding text-white"
          style={{
            background:
              "linear-gradient(301.08deg, #317074 6.63%, #034c82 82.39%)",
          }}
        >
          <div className="container pt-6 sm:text-center">
            <div className="font-semibold text-3xl pb-3">SeaLife</div>
            <div className="text-xl pb-4 sm:pb-6">
              Découvrez les merveilles de la vie marine
            </div>
            <DynamicCustomSearchBox className="sm:hidden pb-4" />
          </div>
        </div>
        {/* END HEADER */}
        <DynamicRegionDropdown className="mb-4 sm:mb-5" />
        <div className="global-padding max-width-500">
          {/* CARDS */}
          <div className="grid">
            <div className="col-6">
              <Link href={`explore/${userRegion}/fauna`}>
                <DynamicExploreCard
                  title="Faune"
                  subtitle={`${faunaGroup.species_count?.[userRegion]} espèces`}
                  blurhash={faunaBackgroundPH.blurhash}
                  image="https://storage.googleapis.com/sea-life-app.appspot.com/img%2Ffauna.jpg"
                />
              </Link>
            </div>
            <div className="col-6">
              <Link href={`explore/${userRegion}/flora`}>
                <DynamicExploreCard
                  title="Flore"
                  subtitle={`${floraGroup.species_count?.[userRegion]} espèces`}
                  blurhash={floraBackgroundPH.blurhash}
                  image="https://storage.googleapis.com/sea-life-app.appspot.com/img%2Fflora.jpg"
                />
              </Link>
            </div>
          </div>
          {/* END CARDS */}
          <div className="py-4">
            <div className="text-lg font-semibold flex mb-3">
              Actualités marines
              <NewspaperSvg
                aria-label="newspaper"
                className="svg-icon ml-2"
                style={{ width: "16px", marginLeft: "1px" }}
              />
            </div>
            <DynamicFacebookPagePosts />
          </div>
        </div>
      </div>
    </>
  );
};
export default Explore;

export const getStaticProps: GetStaticProps = async (context) => {
  // const [faunaBackgroundPH, floraBackgroundPH] = await Promise.all([
  //   getPlaiceholder(
  //     "https://storage.googleapis.com/sea-life-app.appspot.com/img%2Ffauna.jpg"
  //   ),
  //   getPlaiceholder(
  //     "https://storage.googleapis.com/sea-life-app.appspot.com/img%2Fflora.jpg"
  //   ),
  // ]);

  const [faunaGroup, floraGroup] = await Promise.all([
    getGroup("fauna"),
    getGroup("flora"),
  ]);

  return {
    props: { faunaGroup, floraGroup, faunaBackgroundPH: null, floraBackgroundPH: null },
  };
};
