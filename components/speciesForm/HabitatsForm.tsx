import { FormikProvider, useFormik } from "formik";
import { useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { ISpecies } from "../../types/Species";
import { array, object, string } from "yup";
import { createNewSpeciesVersion } from "../../utils/firestore/species.firestore";
import styled from "styled-components";
import { MultiSelect } from "primereact/multiselect";
import { regionsList } from "../../constants/regions";
import { habitatsList } from "../../constants/habitats";

const habitat1Dropdown = habitatsList
  .filter((r) => r.type === 1)
  .map((r) => ({
    id: r.id,
    name: r.title.fr,
  }));

  const habitat2Dropdown = habitatsList
  .filter((r) => r.type === 2)
  .map((r) => ({
    id: r.id,
    name: r.title.fr,
  }));

const HabitatsForm = (props: {
  species: ISpecies;
  submitCallback: any;
  forwardedRef: React.ForwardedRef<any>;
}) => {
  const formik = useFormik<any>({
    initialValues: {
      habitats_1: props.species.habitats_1,
      habitats_2: props.species.habitats_2,
    },
    validationSchema: object().shape({
      habitats_1: array()
        .of(string())
        .min(1, "Au moins un habitat doit être selectionné")
        .required("Champ obligatoire"),
      habitats_2: array().of(string()).nullable(),
    }),
    onSubmit: async (data) => {
      // Check errors
      if (Object.keys(formik.errors).length > 0) {
        return;
      }

      let newData = {
        habitats_1: data.habitats_1,
        habitats_2: data.habitats_2,
      };



      await createNewSpeciesVersion(props.species.id, newData);

      // display success toast
      toast.success("Régions sauvegardées", {
        autoClose: 2000,
        toastId: "successPublication",
      });

      props.submitCallback();
    },
  });

  const isFormFieldValid = (name: string) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name: string) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error text-sm block">
          <ul className="list-disc ml-3">
            <li key={name}>{(formik.errors as any)[name]}</li>
          </ul>
        </small>
      )
    );
  };

  useImperativeHandle(props.forwardedRef, () => ({
    submit: () => {
      formik.handleSubmit();
    },
  }));

  return (
    <Style>
      <FormikProvider value={formik}>
        <div className="mb-4">
          <label htmlFor="depth_max">Habitat (type 1)</label>
          <MultiSelect
            value={formik.values.habitats_1}
            options={habitat1Dropdown}
            onChange={(e) => formik.setFieldValue("habitats_1", e.value)}
            optionValue="id"
            optionLabel="name"
            placeholder="Selectionner les habitats"
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="depth_max">Habitat (type 2)</label>
          <MultiSelect
            value={formik.values.habitats_2}
            options={habitat2Dropdown}
            onChange={(e) => formik.setFieldValue("habitats_2", e.value)}
            optionValue="id"
            optionLabel="name"
            placeholder="Selectionner les habitats"
            className="w-full"
          />
        </div>
      </FormikProvider>
    </Style>
  );
};

const Style = styled.div``;
export default HabitatsForm;
