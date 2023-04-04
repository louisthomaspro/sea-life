import { FormikProvider, useFormik } from "formik";
import { useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { ISpecies } from "../../types/Species";
import { object, string } from "yup";
import { createNewSpeciesVersion } from "../../utils/firestore/species.firestore";
import styled from "styled-components";
import { RadioButton } from "primereact/radiobutton";
import { rarityList } from "../../constants/rarity";

const RarityForm = (props: {
  species: ISpecies;
  submitCallback: any;
  forwardedRef: React.ForwardedRef<any>;
}) => {
  const formik = useFormik<any>({
    initialValues: {
      rarity: props.species.rarity,
    },
    validationSchema: object().shape({
      rarity: string().required("Champ obligatoire"),
    }),
    onSubmit: async (data) => {
      // Check errors
      if (Object.keys(formik.errors).length > 0) {
        return;
      }

      let newData = {
        rarity: data.rarity,
      };

      await createNewSpeciesVersion(props.species.id, newData);

      // display success toast
      toast.success("Rareté sauvegardées", {
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
        {rarityList.map((rarity) => (
          <div className="field-radiobutton" key={rarity.id}>
            <RadioButton
              inputId={`input-${rarity.id}`}
              name="rarity"
              value={rarity.id}
              onChange={formik.handleChange}
              checked={formik.values.rarity === rarity.id}
            />
            <label htmlFor={`input-${rarity.id}`}>{rarity.name.fr}</label>
          </div>
        ))}
      </FormikProvider>
    </Style>
  );
};

const Style = styled.div``;
export default RarityForm;
