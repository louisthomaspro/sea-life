import { useFormik } from "formik";
import debounce from "lodash/debounce";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useCallback, useEffect, useState } from "react";
import { ITaxa } from "../../types/INaturalist/TaxaResponse";
import {
  createLife,
  getGroups,
  getLife,
  getTaxaFromINaturalist,
  iNaturalistSearch,
} from "../../utils/firestore/life.firestore";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import Image from "next/image";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import FrFlagSvg from "../../public/icons/flags/FR.svg";
import GbFlagSvg from "../../public/icons/flags/GB.svg";
import { ILife } from "../../types/Life";
import styled from "styled-components";
import Spinner from "../commons/Spinner";
interface ILifeFormProps {
  onSubmit: () => void;
}

interface ILifeFormValues {
  taxa_id: string;
  main_parent_id: string;
  selected_ancestors: ITaxa[];
}

export default function LifeCreateForm(props: ILifeFormProps) {
  const [taxa, setTaxa] = useState(null as ITaxa);
  const [taxaLoading, setTaxaLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scientificNameLoading, setScientificNameLoading] = useState(false);
  const [scientificNameFound, setScientificNameFound] = useState(false);

  const [invalidTaxa, setInvalidTaxa] = useState(false);
  const [taxaAlreadyExists, setTaxaAlreadyExists] = useState(false);

  const [existingGroups, setExistingGroups] = useState([] as ILife[]);

  useEffect(() => {
    getGroups().then((groups) => {
      setExistingGroups(groups);
    });
  }, []);

  useEffect(() => {
    formik.setFieldTouched("taxa_id", true);
  }, [invalidTaxa, taxaAlreadyExists]);

  // On taxa found, preset form values
  useEffect(() => {
    if (taxa) {
      // Preset main parent (1 === Animal)
      const parentId = taxa.ancestors[0].id === 1 ? "fauna" : "flora";
      formik.setFieldValue("main_parent_id", parentId);

      // Preset ancestors dropdown
      const matchingGroups = taxa.ancestors.filter((ancestor) => {
        return existingGroups.some((group) => {
          return group.id === ancestor.id.toString();
        });
      });
      formik.setFieldValue("selected_ancestors", matchingGroups);
    }
  }, [taxa]);

  const mainParentsOptions = [
    { name: "Faune", id: "fauna" },
    { name: "Flore", id: "flora" },
  ];

  const delayedQuery = useCallback(
    debounce((callback) => callback(), 500),
    []
  );

  const loadTaxaId = (taxaId: number) => {
    // Reset form
    formik.setFieldValue("taxa_id", taxaId);
    formik.setFieldValue("main_parent_id", null);
    formik.setFieldValue("selected_ancestors", []);

    setTaxa(null);
    if (!taxaId) return;
    setTaxaLoading(true);

    delayedQuery(async () => {
      // Check if life already exists
      const life = await getLife(taxaId.toString());
      if (life) {
        setTaxaAlreadyExists(true);
      } else {
        setTaxaAlreadyExists(false);
      }

      // Get taxa
      const taxa = await getTaxaFromINaturalist(taxaId);
      if (taxa) {
        setTaxa(taxa);
        setInvalidTaxa(false);
      } else {
        setInvalidTaxa(true);
      }

      setTaxaLoading(false);
    });
  };

  const handleChangeForTaxaId = (e: any) => {
    const taxaId: number = e.target.value;
    loadTaxaId(taxaId);
  };

  // Sort ancestors by hierarchy
  const handleChangeForAncestors = (e: any) => {
    const ancestors: ITaxa[] = e.target.value;
    ancestors.sort((a, b) => b.rank_level - a.rank_level);

    formik.setFieldValue("selected_ancestors", ancestors);
  };

  // Find taxa id
  const handleChangeForScientificName = (e: any) => {
    setScientificNameLoading(true);
    delayedQuery(async () => {
      const res = await iNaturalistSearch(e.target.value);
      const ids = res.map((r) => r.id);
      if (ids.length === 1) {
        setScientificNameFound(true);
        formik.setFieldValue("taxa_id", ids[0]);
        loadTaxaId(ids[0]);
      } else {
        setScientificNameFound(false);
      }
      setScientificNameLoading(false);
    });
  };

  const groupTemplate = (ancestor: ITaxa) => {
    return (
      <div>
        {ancestor.preferred_common_name}
        <span className="text-color-secondary">
          {ancestor.preferred_common_name && <>&nbsp;-&nbsp;</>}
          {ancestor.name}&nbsp;
          <span className="font-italic">({ancestor.rank})</span>
        </span>
      </div>
    );
  };

  const selectedGroupsTemplate = (ancestor: ITaxa) => {
    if (ancestor) {
      return (
        <div className="chip-item-value">
          {ancestor.preferred_common_name}
          {ancestor.preferred_common_name && <>&nbsp;-&nbsp;</>}
          {ancestor.name}&nbsp;
          <span className="font-italic">({ancestor.rank})</span>
        </div>
      );
    }

    return "Selectionner les ancêtres";
  };

  const formik = useFormik<ILifeFormValues>({
    initialValues: {
      taxa_id: "",
      main_parent_id: null,
      selected_ancestors: [],
    },
    validate: (data) => {
      let errors: any = {};

      // Taxa id
      if (!data.taxa_id) {
        errors.taxa_id = "Taxon ID est requis";
      } else if (invalidTaxa) {
        errors.taxa_id = "Taxon ID invalide";
      } else if (taxaAlreadyExists) {
        errors.taxa_id = "Taxon ID déjà existant. Modifiez le depuis l'arbre.";
      }

      return errors;
    },
    onSubmit: async (data) => {
      setSaving(true);
      const ids = [
        data.main_parent_id,
        ...data.selected_ancestors.map((ancestor) => ancestor.id),
        taxa.id,
      ].map((id) => id.toString());
      await createLife(ids);
      formik.resetForm();

      setTaxa(null);
      props.onSubmit();
      setSaving(false);
    },
  });

  const isFormFieldValid = (name: string) =>
    !!((formik.touched as any)[name] && (formik.errors as any)[name]);
  const getFormErrorMessage = (name: string) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{(formik.errors as any)[name]}</small>
      )
    );
  };

  return (
    <Style>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid">
          <div className="col-5">
            <div className="field">
              <label htmlFor="scientific_name">Nom Scientifique</label>
              <InputText
                id="scientific_name"
                name="scientific_name"
                onChange={(e) => handleChangeForScientificName(e)}
                className="block"
                style={{ width: "250px" }}
                placeholder="ex: Echinaster sepositus"
              />
              {scientificNameLoading && <Spinner />}
              {!scientificNameLoading && (
                <>
                  {scientificNameFound ? (
                    <>ID trouvé ! :)</>
                  ) : (
                    <>Aucun ID trouvé :(</>
                  )}
                </>
              )}
            </div>

            <div className="field">
              <label
                htmlFor="taxa_id"
                className={
                  "block " +
                  classNames({ "p-error": isFormFieldValid("taxa_id") })
                }
              >
                Taxon ID*
              </label>
              <InputText
                id="taxa_id"
                name="taxa_id"
                value={formik.values.taxa_id}
                onChange={(e) => handleChangeForTaxaId(e)}
                keyfilter="int"
                className="block"
                style={{ width: "250px" }}
                placeholder="ex: 123"
              />
              {getFormErrorMessage("taxa_id")}
            </div>

            <div className="field">
              <label htmlFor="main_parent_id" className="block">
                Parent principal
              </label>
              <Dropdown
                id="main_parent_id"
                name="main_parent_id"
                value={formik.values.main_parent_id}
                options={mainParentsOptions}
                onChange={formik.handleChange}
                optionLabel="name"
                optionValue="id"
                placeholder="Selectionner un parent principal"
                style={{ width: "250px" }}
              />
            </div>

            <div className="field">
              <label htmlFor="selected_ancestors" className="block">
                Parents
              </label>
              <MultiSelect
                id="selected_ancestors"
                name="selected_ancestors"
                value={formik.values.selected_ancestors}
                options={taxa?.ancestors}
                onChange={(e) => handleChangeForAncestors(e)}
                display="chip"
                style={{ width: "250px" }}
                disabled={taxa === null}
                itemTemplate={groupTemplate}
                selectedItemTemplate={selectedGroupsTemplate}
                showSelectAll={false}
              />
            </div>
          </div>
          <div className="col-2">
            <Divider layout="vertical" />
          </div>
          <div className="col-5">
            {taxa !== null ? (
              <>
                <div className="flex align-items-center">
                  <div>
                    <FrFlagSvg width="12px" />
                  </div>
                  <div className="mx-1 font-semibold">
                    {taxa.preferred_common_name ?? "(traduction manquante)"}
                  </div>
                </div>
                <div className="flex align-items-center">
                  <div>
                    <GbFlagSvg width="12px" />
                  </div>
                  <div className="mx-1 font-semibold">
                    {taxa.english_common_name ?? "(traduction manquante)"}
                  </div>
                </div>
                <div className="font-italic text-color-secondary">
                  {taxa.name ?? "(nom scientifique manquant)"}
                </div>
                <div className="mt-2">
                  {taxa?.taxon_photos?.[0]?.photo?.medium_url ? (
                    <Image
                      loader={() => taxa.taxon_photos?.[0]?.photo?.medium_url}
                      src={taxa?.taxon_photos?.[0]?.photo?.medium_url}
                      alt={taxa?.name}
                      width={700}
                      height={475}
                      unoptimized={true}
                    />
                  ) : (
                    <>Pas de photo</>
                  )}
                </div>
              </>
            ) : taxaLoading ? (
              <div>Chargement du taxon...</div>
            ) : (
              <div>En attente d&apos;une espèce...</div>
            )}
          </div>
        </div>

        <div className="text-right">
          <Button
            label="Ajouter"
            type="submit"
            disabled={!formik.isValid}
            loading={saving}
          />
        </div>
      </form>
    </Style>
  );
}

// Style
const Style = styled.div`
  .chip-item-value {
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    margin-bottom: 2px;
    background-color: var(--primary-color);
    color: var(--primary-color-text);
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
