import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import styled from "styled-components";
import Header from "../../components/commons/Header";
import SpeciesInformation from "../../components/species/SpeciesInformation";
import { useInView } from "react-cool-inview";
import { useContext, useState } from "react";
import AuthContext from "../../context/auth.context";
import { getSpecies } from "../../utils/firestore/species.firestore";
import { ISpecies } from "../../types/Species";
import SpeciesHeader from "../../components/species/SpeciesHeader";
import { getPlaiceholder } from "plaiceholder";
import { defaultBlurhashOptions } from "../../constants/config";

const Species: NextPage<{
  species: ISpecies;
}> = ({ species }) => {
  const router = useRouter();
  const [showSecondHeader, setShowSecondHeader] = useState(false);
  const { observe, unobserve, inView, scrollDirection, entry } = useInView({
    rootMargin: "100px 0px",
    onEnter: ({ scrollDirection, entry, observe, unobserve }) => {
      setShowSecondHeader(false);
    },
    onLeave: ({ scrollDirection, entry, observe, unobserve }) => {
      setShowSecondHeader(true);
    },
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Style className="no-header">
      <div className="header" ref={observe}>
        <Header showBackButton noBackground>
          <SpeciesHeader species={species} />
        </Header>
      </div>
      {showSecondHeader && (
        <Header
          showBackButton
          fixed
          shadow
          title={species.common_name?.fr[0]}
        />
      )}
      <SpeciesInformation species={species} />
    </Style>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  const species: ISpecies = JSON.parse(
    JSON.stringify(await getSpecies(id.toString()))
  );

  // Generate bluhash for each image
  if (process.env.NEXT_PUBLIC_SKIP_BLURHASH !== "true") {
    await Promise.all(
      species.photos.map(async (photo) => {
        const { blurhash } = await getPlaiceholder(
          photo.original_url,
          defaultBlurhashOptions
        );
        photo.blurhash = blurhash;
      })
    );
  }

  if (species) {
    return { props: { species }, revalidate: 120 };
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

export default Species;

// Style
const Style = styled.div`
  width: 100%;
  overflow: auto;
  position: relative;

  .header {
    position: absolute;
    top: 0;
    z-index: 2;
    width: 100%;
  }
`;
