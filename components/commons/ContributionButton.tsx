import { Sidebar } from "primereact/sidebar";
import styled from "styled-components";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import Button from "./Button";
import { saveContribution } from "../../utils/firestore/species.firestore";
import { useFormik } from "formik";
import { ISpecies } from "../../types/Species";
import { IContributionForm } from "../../types/Contribution";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useState } from "react";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import { SignInToast } from "../../utils/toast.helper";
import PenToSquareSvg from "../../public/icons/fontawesome/light/pen-to-square.svg";

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

interface ContributionButtonProps {
  species: ISpecies;
}

export default function ContributionButton(props: ContributionButtonProps) {
  const auth = getAuth();
  const [saving, setSaving] = useState(false);

  const [contributionVisible, setContributionVisible] = useState(false);
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  let decodedToken: any = null;
  if (user) {
    decodedToken = jwtDecode((user as any).accessToken);
  }

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

      await saveContribution(suggestionForm);

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

  const handleContributionButton = () => {
    // if user signed in
    if (user) {
      if (decodedToken?.isAdmin) {
        router.push(`/species/${props.species.id}/edit`);
      } else {
        setContributionVisible(true);
      }
    } else {
      toast(SignInToast({ message: "Connecte toi pour contribuer" }), {
        toastId: "signIn",
      });
    }
  };

  return (
    <>
      <ContributeButtonStyle onClick={() => handleContributionButton()}>
        Contribuer
        <PenToSquareSvg
          aria-label="contribute"
          className="ml-2 svg-icon"
          style={{ width: "16px" }}
        />
      </ContributeButtonStyle>
      <Sidebar
        visible={contributionVisible}
        position="bottom"
        className="p-sidebar-contribution max-width-800"
        onHide={() => setContributionVisible(false)}
      >
        <Style>
          <form onSubmit={formik.handleSubmit}>
            <div className="title">Contribuer</div>
            <p className="mb-3">
              Contribuez en indiquant les modifications ou ajouts nécessaires.
              Les suggestions seront validées par un modérateur.
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
                <Button $outline className="w-full">
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
    </>
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

const ContributeButtonStyle = styled.button`
  margin: 1rem 0;
  display: flex;
  border: 1px solid #828282;
  border-radius: 100px;
  padding: 0.3rem 1rem;
  cursor: pointer;
`;
