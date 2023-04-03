import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import BackButton from "../../../components/commons/BackButton";
import MyButton from "../../../components/commons/MyButton";
import Spinner from "../../../components/commons/Spinner";
import SpeciesCard from "../../../components/explore/SpeciesCard";
import { withAuthServerSideProps } from "../../../firebase/withAuth";
import { ITaxa } from "../../../types/INaturalist/TaxaResponse";
import { ISpecies } from "../../../types/Species";
import {
  getSpeciesById,
  saveSpeciesByScientificName,
} from "../../../utils/firestore/species.firestore";
import {
  getSpeciesIdFromScientificName,
  iNaturalistSearchOnlySpecies,
} from "../../../utils/helper";

enum SpeciesErrorStatus {
  DELETED_SPECIES = "DELETED_SPECIES",
  PUBLISHED_SPECIES = "PUBLISHED_SPECIES",
  NOT_FOUND = "NOT_FOUND",
}

const AddSpecies: NextPage = () => {
  const [value, setValue] = useState<string>("");
  const [speciesFound, setSpeciesFound] = useState<any>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<ITaxa[]>(null);
  const [speciesErrorStatus, setSpeciesErrorStatus] =
    useState<SpeciesErrorStatus>(null);

  // States for loading
  const [publishing, setPublishing] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);

  const searchSpecies = async (query: string) => {
    // Reset states
    setSearchSuggestions(null);
    setSpeciesFound(null);
    setSpeciesErrorStatus(null);

    setSearching(true);
    const taxaList = await iNaturalistSearchOnlySpecies(query);

    if (
      taxaList.length > 0 &&
      taxaList[0].name.toLowerCase() === query.toLowerCase()
    ) {
      // Check if species not already published
      const speciesId = getSpeciesIdFromScientificName(taxaList[0].name);
      const species = await getSpeciesById(speciesId);
      if (species) {
        if (species.is_deleted) {
          setSpeciesErrorStatus(SpeciesErrorStatus.DELETED_SPECIES);
        } else {
          setSpeciesErrorStatus(SpeciesErrorStatus.PUBLISHED_SPECIES);
        }
        setSearching(false);
        return;
      }

      // Otherwise, species found
      setSpeciesFound({
        scientific_name: taxaList[0].name,
        common_names: {
          fr: [taxaList[0].preferred_common_name],
          en: [taxaList[0].english_common_name],
        },
        photos: taxaList[0].taxon_photos.map((p) => {
          return {
            original_url: p.photo.original_url,
            attribution: p.photo.attribution,
          };
        }),
      });
    } else {
      setSpeciesErrorStatus(SpeciesErrorStatus.NOT_FOUND);
      setSearchSuggestions(taxaList);
    }
    setSearching(false);
  };

  const searchSuggestion = (scientificName: string) => {
    setValue(scientificName);
    searchSpecies(scientificName);
  };

  const cancelSearch = () => {
    setValue("");
    setSearchSuggestions(null);
    setSpeciesFound(null);
    setSpeciesErrorStatus(null);
  };

  const publishSpecies = () => {
    setPublishing(true);

    saveSpeciesByScientificName(speciesFound.scientific_name)
      .then(() => {
        toast.success("Espèce publiée avec succès");
        setValue("");
        setSpeciesFound(null);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Une erreur est survenue");
      })
      .finally(() => {
        setPublishing(false);
      });

    // Prepare species to be published
    // const speciesToPublish: any = {
    //   id: ,
    //   is_deleted: false,
    //   scientific_name: speciesFound.scientific_name,
    // };
  };

  return (
    <>
      <div className="global-padding max-width-800">
        <BackButton className="pt-2" />
        <div className="max-width-500 mt-3">
          {speciesFound ? (
            <div className="m-auto" style={{ maxWidth: "300px" }}>
              <SpeciesCard species={speciesFound} />
            </div>
          ) : (
            <>
              <div className="flex flex-column">
                <label htmlFor="scientific_name" className="mb-1">
                  Nom scientifique de l'espèce
                </label>
                <InputText
                  id="scientific_name"
                  name="scientific_name"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="mb-2"
                />
              </div>
              {searching && <Spinner />}
              <div>
                {speciesErrorStatus === SpeciesErrorStatus.DELETED_SPECIES && (
                  <div className="mb-3 error-message">
                    Cette espèce a été supprimée. Vous pouvez la restaurer dans
                    la section "Espèces supprimées"
                  </div>
                )}
                {speciesErrorStatus ===
                  SpeciesErrorStatus.PUBLISHED_SPECIES && (
                  <div className="mb-3 error-message">
                    Cette espèce est déjà publiée.
                  </div>
                )}
                {speciesErrorStatus === SpeciesErrorStatus.NOT_FOUND && (
                  <div className="mb-3 error-message">
                    Espèce introuvable. Veuillez vérifier le nom scientifique et
                    réessayer.
                  </div>
                )}
                {speciesErrorStatus &&
                  searchSuggestions &&
                  searchSuggestions.length > 0 && (
                    <>
                      <div className="mb-1">Suggestions :</div>
                      <ul className="list-disc ml-4">
                        {searchSuggestions.map((taxa) => (
                          <li
                            className="link"
                            onClick={() => searchSuggestion(taxa.name)}
                            key={taxa.id}
                          >
                            {taxa.name}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
      <BottomActions className="shadow-3 px-3">
        <div className="grid grid-nogutter max-width-500 h-full align-items-center justify-content-center">
          {speciesFound ? (
            <>
              <div className="col-6 pr-1">
                <MyButton
                  outline
                  className="w-full"
                  disabled={publishing}
                  onClick={() => cancelSearch()}
                >
                  Annuler
                </MyButton>
              </div>
              <div className="col-6 pl-1">
                <MyButton
                  primary
                  className="w-full"
                  type="submit"
                  disabled={publishing}
                  onClick={() => publishSpecies()}
                >
                  Publier
                </MyButton>
              </div>
            </>
          ) : (
            <div style={{ width: "calc(100% / 2)" }}>
              <MyButton
                primary
                className="w-full"
                disabled={searching || value.length === 0}
                onClick={() => {
                  searchSpecies(value);
                }}
              >
                Chercher
              </MyButton>
            </div>
          )}
        </div>
      </BottomActions>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(
  async (context: GetServerSidePropsContext, decodedToken: any) => {
    if (!decodedToken || !decodedToken?.isAdmin) {
      console.error("Not authorized");
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  }
);

const BottomActions = styled.div`
  height: var(--bottom-navigation-height);
  position: fixed;
  bottom: 0;
  z-index: 101;
  width: 100%;
`;

export default AddSpecies;
