import { Sidebar, SidebarProps } from "primereact/sidebar";
import styled from "styled-components";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import Button from "./Button";
import { createContribution } from "../../utils/firestore/species.firestore";
import { useFormik } from "formik";
import { ISpecies } from "../../types/Species";
import { IContributionForm } from "../../types/Contribution";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useState } from "react";

const fields = [
  { name: "Photos", id: "photos" },
  { name: "Nom", id: "name" },
  { name: "Habitat", id: "habitat" },
  { name: "Région", id: "region" },
  { name: "Comportement", id: "behavior" },
  { name: "Morphologie", id: "morphology" },
  { name: "Taille", id: "size" },
  { name: "Profondeur", id: "depth" },
  { name: "Rareté", id: "rarity" },
  { name: "Taxonomies", id: "taxonomy" },
  { name: "Autres", id: "others" },
];

interface IContributionSideBarProps extends SidebarProps {
  species: ISpecies;
}

export default function ContributionSideBar(props: IContributionSideBarProps) {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [saving, setSaving] = useState(false);

  const formik = useFormik<any>({
    initialValues: {
      field: null,
      comment: "",
    },
    validate: (data) => {
      let errors: any = {};

      if (!data.field) {
        errors.field = "Champ requis";
      }
      if (!data.comment) {
        errors.comment = "Champ requis";
      }

      return errors;
    },
    onSubmit: async (data) => {
      setSaving(true);

      const suggestionForm: IContributionForm = {
        field: data.field,
        newValue: null,
        comment: data.comment,
        userId: user.uid,
        speciesId: props.species.id,
      };

      await createContribution(suggestionForm);

      props.onHide!();

      // display success toast
      toast.success("Merci pour ta contribution", {
        toastId: "successContribution",
      });

      formik.resetForm();
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
    <Sidebar {...props} className={`${props.className} max-width-800`}>
      <Style>
        <form onSubmit={formik.handleSubmit}>
          <div className="title">Contribuer</div>
          <p className="mb-3">
            Contribuez en indiquant les modifications ou ajouts nécessaires. Les
            suggestions seront validées par un modérateur.
          </p>
          <div className="mb-2">
            <Dropdown
              id="field"
              name="field"
              options={fields}
              optionLabel="name"
              optionValue="id"
              placeholder="Choisir le champ à modifier"
              className="w-full"
              value={formik.values.field}
              onChange={formik.handleChange}
            />
            {getFormErrorMessage("field")}
          </div>

          <div className="mb-3">
            <InputTextarea
              id="comment"
              name="comment"
              rows={5}
              cols={30}
              placeholder="Commentaire..."
              className="w-full"
              value={formik.values.comment}
              onChange={formik.handleChange}
            />
            {getFormErrorMessage("comment")}
          </div>

          <div className="grid">
            <div className="col-6">
              <Button $outline className="w-full" >
                Annuler
              </Button>
            </div>
            <div className="col-6">
              <Button className="w-full" type="submit">
                Envoyer
              </Button>
            </div>
          </div>
        </form>
      </Style>
    </Sidebar>
  );
}

// Style
const Style = styled.div`
  .title {
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
    top: 30px;
    font-size: 1.5rem;
  }
`;
