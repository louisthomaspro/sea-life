import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import styled from "styled-components";
import { useInView } from "react-cool-inview";
import { getSpecies } from "../../utils/firestore/species.firestore";
import { ISpecies } from "../../types/Species";
import { capitalizeWords } from "../../utils/helper";
import BackButton from "../../components/commons/BackButton";
import ScrollHeader from "../../components/commons/ScrollHeader";
import SpeciesEnvironment from "../../components/species/SpeciesEnvironment";
import Section from "../../components/commons/Section";
import SpeciesSlider from "../../components/species/SpeciesSlider";
import SpeciesTitle from "../../components/species/SpeciesTitle";
import SpeciesHighlight from "../../components/species/SpeciesHighlight";
import SpeciesTaxonomy from "../../components/species/SpeciesTaxonomy";

const Species: NextPage<{
  species: ISpecies;
}> = ({ species }) => {
  return (
    <>
      <ScrollHeader title={capitalizeWords(species.common_names?.fr[0])} />
      <Style className="max-width-800 sm:mt-4">
        <BackButton className="pt-2 sm:hidden global-padding absolute top-0 z-1" />
        <div className="grid grid-nogutter sm:mb-1">
          <div className="col-12 sm:col-6">
            <SpeciesSlider species={species} />
          </div>
          <div className="col-12 sm:col-6">
            <div className="global-padding pt-0">
              <SpeciesTitle species={species} />
              <SpeciesHighlight species={species} />
            </div>
            {/* <SpeciesAnecdote species={props.species} /> */}
          </div>
        </div>

        <div className="global-padding">
          <div className="grid web-divider sm:mb-5">
            <div className="col-12 sm:col-4 sm:pr-3">
              <Section title="ENVRIONNEMENT">
                <SpeciesEnvironment species={species} />
              </Section>
            </div>
            <div className="col-12 sm:col-4 sm:pr-3">
              <Section title="MODE DE VIE ET COMPORTEMENT">
                Prochainement...
              </Section>
            </div>
            <div className="col-12 sm:col-4 sm:pr-3">
              <Section title="MORPHOLOGIE">Prochainement...</Section>
            </div>
          </div>
          <Section title="TAXONOMIE">
            <SpeciesTaxonomy species={species} />
          </Section>
        </div>
      </Style>
    </>
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
  padding-bottom: 1rem;

  @media (min-width: 576px) {
    .web-divider > div:not(:last-child) > div {
      border-right: 1px solid var(--border-color-light);
    }
  }
`;
