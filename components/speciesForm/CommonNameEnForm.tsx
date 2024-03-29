import { FormikProvider, useFormik } from "formik";
import { useImperativeHandle } from "react";
import { toast } from "react-toastify";
import { ISpecies } from "../../types/Species";
import { InputText } from "primereact/inputtext";
import { FieldArray } from "formik";
import { object, array, string } from "yup";
import { StrictModeDroppable } from "../../utils/StrictModeDroppable";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import BarsSvg from "../../public/icons/fontawesome/light/bars.svg";
import { createNewSpeciesVersion } from "../../utils/firestore/species.firestore";
import MyButton from "../commons/MyButton";
import TrashCanSvg from "../../public/icons/fontawesome/light/trash-can.svg";
import styled from "styled-components";

const CommonNameEnForm = (props: {
  species: ISpecies;
  submitCallback: any;
  forwardedRef: React.ForwardedRef<any>;
}) => {
  const formik = useFormik<any>({
    initialValues: {
      names: props.species.common_names.en,
    },
    validationSchema: object().shape({
      names: array().of(
        string()
          .required("Champ obligatoire")
          .min(2, "Le nom doit contenir au moins 2 caractères")
      ),
    }),
    onSubmit: async (data) => {
      // Check errors
      if (Object.keys(formik.errors).length > 0) {
        return;
      }

      let newData = { common_names: props.species.common_names };
      newData.common_names.en = data.names;

      await createNewSpeciesVersion(props.species.id, newData);

      // display success toast
      toast.success("Noms sauvegardés", {
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
            {(formik.errors[name] as string[]).map(
              (error: string, index: number) => (
                <li key={index}>{error}</li>
              )
            )}
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

  const onDragEnd = ({ destination, source }: any) => {
    // If no destination or same index, do nothing
    if (!destination || destination.index === source.index) {
      return;
    }

    // Reorder the names array
    formik.setValues((values: any) => {
      const names = Array.from(values.names);
      const [removed] = names.splice(source.index, 1);
      names.splice(destination.index, 0, removed);
      return { ...values, names };
    });
  };

  return (
    <Style>
      <FormikProvider value={formik}>
        <div className="mb-2">{getFormErrorMessage("names")}</div>
        <DragDropContext onDragEnd={onDragEnd}>
          <FieldArray name="names">
            {(arrayHelpers) => (
              <StrictModeDroppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {formik.values.names.map((name: any, index: any) => (
                      <Draggable
                        draggableId={"box-" + index}
                        key={"box-" + index}
                        index={index}
                        shouldRespectForcePress={false}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="mb-2 flex"
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="flex px-3"
                            >
                              <BarsSvg
                                aria-label="drag-icon"
                                className="svg-icon"
                                style={{ width: "22px" }}
                              />
                            </div>

                            <InputText
                              type="text"
                              name={`names.${index}`}
                              value={name}
                              onChange={formik.handleChange}
                              className="w-full"
                            />
                            <div
                              className="flex px-3"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <TrashCanSvg
                                aria-label="drag-icon"
                                className="svg-icon-destructive"
                                style={{
                                  width: "16px",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <MyButton
                      className="mt-2"
                      onClick={() => arrayHelpers.push("")}
                    >
                      + Ajouter un nom
                    </MyButton>
                  </div>
                )}
              </StrictModeDroppable>
            )}
          </FieldArray>
        </DragDropContext>
      </FormikProvider>
    </Style>
  );
};

const Style = styled.div``;
export default CommonNameEnForm;
