import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import styled from "styled-components";
import {
  getAllSpecies,
  getSpeciesById,
} from "../../utils/firestore/species.firestore";
import { ISpecies } from "../../types/Species";
import { capitalizeFirstLetter, capitalizeWords } from "../../utils/helper";
import BackButton from "../../components/commons/BackButton";
import ScrollHeader from "../../components/commons/ScrollHeader";
import SpeciesEnvironment from "../../components/species/SpeciesEnvironment";
import Section from "../../components/commons/Section";
import SpeciesSlider from "../../components/species/SpeciesSlider/SpeciesSlider";
import SpeciesTitle from "../../components/species/SpeciesTitle/SpeciesTitle";
import SpeciesHighlight from "../../components/species/SpeciesHighlight";
import SpeciesTaxonomy from "../../components/species/SpeciesTaxonomy";
import SpeciesBehavior from "../../components/species/SpeciesBehavior";
import dynamic from "next/dynamic";

const DynamicContributionButton = dynamic(
  () => import("../../components/commons/ContributionButton")
);

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
              <DynamicContributionButton species={species} />
              <SpeciesHighlight species={species} />
            </div>
            {/* <SpeciesAnecdote species={props.species} /> */}
          </div>
        </div>

        <div className="global-padding">
          <div className="grid web-divider sm:mb-5">
            <SpeciesEnvironment
              species={species}
              className="col-12 sm:col-4 sm:pr-3"
            />

            <SpeciesBehavior
              species={species}
              className="col-12 sm:col-4 sm:pr-3"
            />

            <div className="col-12 sm:col-4 sm:pr-3">
              <Section title="MORPHOLOGIE">Prochainement...</Section>
            </div>
          </div>

          <SpeciesTaxonomy species={species} />
        </div>
      </Style>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  let species: ISpecies = JSON.parse(
    JSON.stringify(await getSpeciesById(id.toString()))
  );

  // Capitalize commons names
  species.common_names.fr = species.common_names.fr.map((name) =>
    capitalizeWords(name)
  );
  species.common_names.en = species.common_names.en.map((name) =>
    capitalizeWords(name)
  );
  species.scientific_name = capitalizeFirstLetter(species.scientific_name);

  if (species) {
    return { props: { species } };
  } else {
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const speciesPaths = await getAllSpecies().then((species) => {
    return species.map((s) => {
      return {
        params: {
          id: s.id,
        },
      };
    });
  });

  return {
    paths:
      process.env.SKIP_BUILD_STATIC_GENERATION === "true" ? [] : speciesPaths,
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
