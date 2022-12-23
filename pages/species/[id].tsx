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

const Species: NextPage<{
  species: ISpecies;
}> = ({ species }) => {
  const router = useRouter();
  const [displayFixedHeader, setDisplayFixedHeader] = useState(false);

  const { userData } = useContext(AuthContext);

  const { observe, unobserve, inView, scrollDirection, entry } = useInView({
    onEnter: ({ scrollDirection, entry, observe, unobserve }) => {
      setDisplayFixedHeader(false);
    },
    onLeave: ({ scrollDirection, entry, observe, unobserve }) => {
      setDisplayFixedHeader(true);
    },
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Style>
      <>
        <div className="absolute z-1 w-full">
          <Header showBackButton noBackground />
        </div>
        <SpeciesInformation species={species} />
      </>
    </Style>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  const species: ISpecies = JSON.parse(
    JSON.stringify(await getSpecies(id.toString()))
  );

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
    fallback: true,
  };
};

export default Species;

// Style
const Style = styled.div`
  width: 100%;
  overflow: auto;
  position: relative;

  .fixedHeader {
    position: fixed;
    z-index: 1;
    width: 100%;
  }
`;
