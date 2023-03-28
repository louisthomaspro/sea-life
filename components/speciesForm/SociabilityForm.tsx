import { FormikProvider, useFormik } from "formik";
import { useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { ISpecies } from "../../types/Species";
import { object, string } from "yup";
import { saveNewSpeciesVersion } from "../../utils/firestore/species.firestore";
import styled from "styled-components";
import { RadioButton } from "primereact/radiobutton";
import { sociabilityList } from "../../constants/sociability";

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
            inputId="input-null"
            name="sociability"
            value={null}
            onChange={formik.handleChange}
            checked={formik.values.sociability === null}
          />
          <label htmlFor="input1">Aucun comportement social</label>
        </div>
        
        {sociabilityList.map((sociability) => (
          <div className="field-radiobutton" key={sociability.id}>
            <RadioButton
              inputId={`input-${sociability.id}`}
              name="rarity"
              value={sociability.id}
              onChange={formik.handleChange}
              checked={formik.values.sociability === sociability.id}
            />
            <label htmlFor={`input-${sociability.id}`}>{sociability.name.fr}</label>
          </div>
        ))}
      </FormikProvider>
    </Style>
  );
};

const Style = styled.div``;
export default SociabilityForm;
