import { FormikProvider, useFormik } from "formik";
import { useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { ISpecies } from "../../types/Species";
import { object, ref as refYup, number } from "yup";
import { saveNewSpeciesVersion } from "../../utils/firestore/species.firestore";
import styled from "styled-components";
import { InputNumber } from "primereact/inputnumber";

const DepthForm = (props: {
  species: ISpecies;
  submitCallback: any;
  forwardedRef: React.ForwardedRef<any>;
}) => {
  const formik = useFormik<any>({
    initialValues: {
      depth_min: props.species.depth_min || 0,
      depth_max: props.species.depth_max,
    },
    validationSchema: object().shape({
      depth_min: number(),
      depth_max: number().moreThan(
        refYup("depth_min"),
        "La profondeur maximum doit être supérieure à la profondeur minimum"
      ),
    }),
    onSubmit: async (data) => {
      // Check errors
      if (Object.keys(formik.errors).length > 0) {
        return;
      }

      let newData = {
        depth_min: data.depth_min || 0,
        depth_max: data.depth_max,
      };

      await saveNewSpeciesVersion(props.species.id, newData);

      // display success toast
      toast.success("Profondeurs sauvegardées", {
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
          <label htmlFor="depth_min">Profondeur minimum</label>
          <InputNumber
            id="depth_min"
            name="depth_min"
            onChange={(values) => {
              formik.setFieldValue("depth_min", values.value);
            }}
            mode="decimal"
            locale="fr-FR"
            maxFractionDigits={2}
            value={formik.values.depth_min}
            className={`mt-2 w-full ${
              isFormFieldValid("depth_min") ? "p-invalid" : undefined
            }`}
          />
          {getFormErrorMessage("depth_min")}
        </div>
        <div className="mb-4">
          <label htmlFor="depth_max">Profondeur maximum</label>
          <InputNumber
            id="depth_max"
            name="depth_max"
            onChange={(values) => {
              formik.setFieldValue("depth_max", values.value);
            }}
            mode="decimal"
            locale="fr-FR"
            maxFractionDigits={2}
            value={formik.values.depth_max}
            className={`mt-2 w-full ${
              isFormFieldValid("depth_max") ? "p-invalid" : undefined
            }`}
          />
          {getFormErrorMessage("depth_max")}
        </div>
      </FormikProvider>
    </Style>
  );
};

const Style = styled.div``;
export default DepthForm;