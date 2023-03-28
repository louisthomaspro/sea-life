import { FormikProvider, useFormik } from "formik";
import { useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { ISpecies } from "../../types/Species";
import { object, string } from "yup";
import { saveNewSpeciesVersion } from "../../utils/firestore/species.firestore";
import styled from "styled-components";
import { RadioButton } from 'primereact/radiobutton';

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

      await saveNewSpeciesVersion(props.species.id, newData);

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
        <div className="field-radiobutton">
          <RadioButton
            inputId="input1"
            name="rarity"
            value="rare"
            onChange={formik.handleChange}
            checked={formik.values.rarity === "rare"}
          />
          <label htmlFor="input1">Rare</label>
        </div>
        <div className="field-radiobutton">
          <RadioButton
            inputId="input2"
            name="rarity"
            value="uncommon"
            onChange={formik.handleChange}
            checked={formik.values.rarity === "uncommon"}
          />
          <label htmlFor="input2">Peu commun</label>
        </div>
        <div className="field-radiobutton">
          <RadioButton
            inputId="input3"
            name="rarity"
            value="common"
            onChange={formik.handleChange}
            checked={formik.values.rarity === "common"}
          />
          <label htmlFor="input3">Commun</label>
        </div>
        <div className="field-radiobutton">
          <RadioButton
            inputId="input4"
            name="rarity"
            value="abundant"
            onChange={formik.handleChange}
            checked={formik.values.rarity === "abundant"}
          />
          <label htmlFor="input4">Abundant</label>
        </div>
      </FormikProvider>
    </Style>
  );
};

const Style = styled.div``;
export default RarityForm;