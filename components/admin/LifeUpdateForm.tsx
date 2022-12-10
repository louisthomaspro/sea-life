import { useFormik } from "formik";
import { getLife, updateLife } from "../../utils/firestore/life.firestore";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { ILife, ILifePhoto } from "../../types/Life";
import { InputText } from "primereact/inputtext";
import PhotoUpdate from "./PhotosUpdate";
import Spinner from "../commons/Spinner";
import { revalidateId } from "../../utils/helper";
import { toast } from "react-toastify";

interface ILifeFormProps {
  id: string;
  onSubmit: () => void;
}

interface ILifeFormValues {
  french_common_name: string;
  english_common_name: string;
  group_short_description: string;
}

export default function LifeUpdateForm(props: ILifeFormProps) {
  const [photos, setPhotos] = useState<ILifePhoto[]>([]);
  const [newPhotos, setNewPhotos] = useState<ILifePhoto[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [life, setLife] = useState<ILife>(null);

  useEffect(() => {
    setLoading(true);
    getLife(props.id).then((life) => {
      setLife(life);

      if (life) {
        formik.setFieldValue(
          "french_common_name",
          life.french_common_name ?? ""
        );
        formik.setFieldValue(
          "english_common_name",
          life.english_common_name ?? ""
        );
        formik.setFieldValue(
          "group_short_description",
          life.group_short_description ?? ""
        );

        setPhotos(life.photos);
        setLoading(false);
      }
    });
  }, []);

  const formik = useFormik<ILifeFormValues>({
    initialValues: {
      french_common_name: "",
      english_common_name: "",
      group_short_description: "",
    },
    validate: (data) => {
      let errors: any = {};
      return errors;
    },
    onSubmit: async (data) => {
      setSaving(true);
      await updateLife({ ...data, photos: newPhotos }, props.id);
      Promise.all([revalidateId(life.id), revalidateId(life.parent_id)]);
      formik.resetForm();
      setPhotos([]);
      toast.success(
        "Espèce modifiée. Les modifications apparaîtront dans quelques secondes"
      );
      props.onSubmit();
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
    <div className="mb-2">
      {loading ? (
        <div className="flex justify-content-center">
          <Spinner />
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          {/* NOM COMMUN FRANCAIS */}
          <div className="field">
            <label>Nom commun français</label>
            <InputText
              id="french_common_name"
              name="french_common_name"
              value={formik.values.french_common_name}
              onChange={formik.handleChange}
              className="block"
              style={{ width: "250px" }}
            />
          </div>

          {/* NOM COMMUN ANGLAIS */}
          <div className="field">
            <label>Nom commun anglais</label>
            <InputText
              id="english_common_name"
              name="english_common_name"
              value={formik.values.english_common_name}
              onChange={formik.handleChange}
              className="block"
              style={{ width: "250px" }}
            />
          </div>

          {/* AUTRE NOMS FRANCAIS */}
          <div className="field">
            <label>Description brève du group</label>
            <InputText
              id="group_short_description"
              name="group_short_description"
              value={formik.values.group_short_description}
              onChange={formik.handleChange}
              className="block"
              style={{ width: "250px" }}
            />
          </div>

          <PhotoUpdate
            photos={photos}
            onChange={(photos) => {
              setNewPhotos(photos);
            }}
          />

          <div className="text-right">
            <Button
              label="Sauvegarder"
              type="submit"
              className="mt-2"
              disabled={!formik.isValid}
              loading={saving}
            />
          </div>
        </form>
      )}
    </div>
  );
}
