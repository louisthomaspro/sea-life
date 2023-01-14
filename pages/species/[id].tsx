import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import styled from "styled-components";
import Header from "../../components/commons/Header";
import SpeciesInformation from "../../components/species/SpeciesInformation";
import { useInView } from "react-cool-inview";
import { getSpecies } from "../../utils/firestore/species.firestore";
import { ISpecies } from "../../types/Species";
import SpeciesHeader from "../../components/species/SpeciesHeader"
import { capitalizeWords } from "../../utils/helper";

const Species: NextPage<{
  species: ISpecies;
}> = ({ species }) => {
  const { observe, unobserve, inView, scrollDirection, entry } = useInView({
    rootMargin: "100px 0px",
  });

  return (
    <Style className="max-width-800">
      <div className="header sm:relative" ref={observe}>
        <Header showBackButton noBackground>
          <SpeciesHeader species={species} />
        </Header>
      </div>
      {!inView && (
        <Header
          showBackButton
          fixed
          shadow
          title={capitalizeWords(species.common_names?.fr[0])}
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
