import { FormikProvider, useFormik } from "formik";
import { useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { ISpecies } from "../../types/Species";
import { array, object, string } from "yup";
import { saveNewSpeciesVersion } from "../../utils/firestore/species.firestore";
import styled from "styled-components";
import { MultiSelect } from "primereact/multiselect";
import { regionsList } from "../../constants/regions";

const regionsDropdown = regionsList
  .filter((r) => r.id !== "all")
  .map((r) => ({
    id: r.id,
    name: r.name.fr,
  }));

const RegionsForm = (props: {
  species: ISpecies;
  submitCallback: any;
  forwardedRef: React.ForwardedRef<any>;
}) => {
  const formik = useFormik<any>({
    initialValues: {
      regions: props.species.regions,
    },
    validationSchema: object().shape({
      regions: array()
        .of(string())
        .min(1, "Au moins une région doit être selectionnées")
        .required("Champ obligatoire"),
    }),
    onSubmit: async (data) => {
      // Check errors
      if (Object.keys(formik.errors).length > 0) {
        return;
      }

      let newData = {
        regions: data.regions,
      };

      await saveNewSpeciesVersion(props.species.id, newData);

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
        <MultiSelect
          value={formik.values.regions}
          options={regionsDropdown}
          onChange={(e) => formik.setFieldValue("regions", e.value)}
          optionValue="id"
          optionLabel="name"
          placeholder="Selectionner les régions"
          className="w-full"
          maxSelectedLabels={3}
        />
      </FormikProvider>
    </Style>
  );
};

const Style = styled.div``;
export default RegionsForm;
