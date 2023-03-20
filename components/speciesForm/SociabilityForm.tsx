import { FormikProvider, useFormik } from "formik";
import { useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { ISpecies } from "../../types/Species";
import { object, string } from "yup";
import { saveNewSpeciesVersion } from "../../utils/firestore/species.firestore";
import styled from "styled-components";
import { RadioButton } from "primereact/radiobutton";

const SociabilityForm = (props: {
  species: ISpecies;
  submitCallback: any;
  forwardedRef: React.ForwardedRef<any>;
}) => {
  const formik = useFormik<any>({
    initialValues: {
      sociability: props.species.sociability,
    },
    validationSchema: object().shape({
      sociability: string().required("Champ obligatoire"),
    }),
    onSubmit: async (data) => {
      // Check errors
      if (Object.keys(formik.errors).length > 0) {
        return;
      }

      let newData = {
        sociability: data.sociability,
      };

      await saveNewSpeciesVersion(props.species.id, newData);

      // display success toast
      toast.success("Comportement social sauvegardées", {
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
        <div className="field-radiobutton">
          <RadioButton
            inputId="input0"
            name="sociability"
            value={null}
            onChange={formik.handleChange}
            checked={formik.values.sociability === null}
          />
          <label htmlFor="input1">Aucun comportement social</label>
        </div>
        <div className="field-radiobutton">
          <RadioButton
            inputId="input1"
            name="sociability"
            value="solitary"
            onChange={formik.handleChange}
            checked={formik.values.sociability === "solitary"}
          />
          <label htmlFor="input1">Vivant en solitaire</label>
        </div>
        <div className="field-radiobutton">
          <RadioButton
            inputId="input2"
            name="sociability"
            value="couple"
            onChange={formik.handleChange}
            checked={formik.values.sociability === "couple"}
          />
          <label htmlFor="input2">Vivant en couple</label>
        </div>
        <div className="field-radiobutton">
          <RadioButton
            inputId="input3"
            name="sociability"
            value="group"
            onChange={formik.handleChange}
            checked={formik.values.sociability === "group"}
          />
          <label htmlFor="input3">Vivant en groupe</label>
        </div>
        <div className="field-radiobutton">
          <RadioButton
            inputId="input4"
            name="sociability"
            value="shoal"
            onChange={formik.handleChange}
            checked={formik.values.sociability === "shoal"}
          />
          <label htmlFor="input4">Vivant en banc</label>
        </div>
      </FormikProvider>
    </Style>
  );
};

const Style = styled.div``;
export default SociabilityForm;
