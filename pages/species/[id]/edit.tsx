import { m } from "framer-motion";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useRef, useState } from "react";
import styled from "styled-components";
import Header from "../../../components/commons/Header";
import { withAuthServerSideProps } from "../../../firebase/withAuth";
import { ISpecies } from "../../../types/Species";
import { getSpecies } from "../../../utils/firestore/species.firestore";
import { capitalizeWords } from "../../../utils/helper";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import CommonNameFrForm from "../../../components/speciesForm/CommonNameFrForm";
import MyButton from "../../../components/commons/MyButton";

const Edit: NextPage<{
  species: ISpecies;
}> = ({ species }) => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const childFormRef = useRef(null);

  const handleChildFormSubmit = async () => {
    childFormRef.current.submit();
  };

  const fields: any[] = [
    {
      id: "common_names_fr",
      label: "Nom communs francophones",
      value: capitalizeWords(species.common_names.fr.join(", ")),
    },
    {
      id: "common_names_en",
      label: "Noms communs anglophones",
      value: capitalizeWords(species.common_names.en.join(", ")),
    },
    {
      id: "sizes",
      label: "Tailles",
      value: (
        <>
          Taille maximum: ${species.sizes.max_length || "-"}
          <br /> Taille moyenne: {species.sizes.common_length || "-"}
          <br /> Diamètre moyen: {species.sizes.common_diameter || "-"}
        </>
      ),
    },
  ];

  fields.forEach((field) => {
    field.onClick = () => {
      setSelectedField(field.id);
      setShowDialog(true);
    };
  });

  const closeDialog = () => {
    setSelectedField(null);
    setShowDialog(false);
  };

  const dialogFooter = (
    <div className="grid">
      <div className="col-6">
        <MyButton
          outline
          className="w-full"
          onClick={() => {
            closeDialog();
          }}
        >
          Annuler
        </MyButton>
      </div>
      <div className="col-6">
        <MyButton
          primary
          className="w-full"
          type="submit"
          onClick={() => {
            handleChildFormSubmit();
          }}
        >
          Publier
        </MyButton>
      </div>
    </div>
  );

  return (
    <>
      <Style className="max-width-800">
        <Header title={"Edit"} showBackButton />
        <ListMenu className="max-width-500">
          {fields.map((field) => (
            <ItemStyle
              key={field.id}
              className="global-padding"
              onClick={field.onClick}
            >
              <div className="label">{field.label}</div>
              <div className="value">{field.value}</div>
            </ItemStyle>
          ))}
        </ListMenu>
      </Style>
      {/* {selectedField === "common_names_fr" && <CommonNameFrForm species={species} ref={childFormRef} />} */}
      <Dialog
        header={fields.find((field) => field.id === selectedField)?.label}
        visible={showDialog}
        style={{
          width: "100vw",
          height: "100vh",
          maxHeight: "100vh",
          margin: 0,
        }}
        footer={dialogFooter}
        onHide={() => {
          closeDialog();
        }}
      >
        <div className="py-3">
          {selectedField === "common_names_fr" && (
            <CommonNameFrForm
              species={species}
              ref={childFormRef}
              submitCallback={() => closeDialog()}
            />
          )}
        </div>
      </Dialog>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(
  async (context: GetServerSidePropsContext, decodedToken: any) => {
    if (!decodedToken || !decodedToken?.isAdmin) {
      console.error("Not authorized");
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const { id } = context.params;
    const species: ISpecies = JSON.parse(
      JSON.stringify(await getSpecies(id.toString()))
    );

    return {
      props: { species },
    };
  }
);

export default Edit;

// Style
const Style = styled.div`
  .img-wrapper {
    width: 100%;
    position: relative;
    padding-bottom: 70%;
    overflow: hidden;
    margin-bottom: 10px;
  }
`;

const ListMenu = styled.div`
  list-style: none;
`;

const ItemStyle = styled(m.div)`
  border-bottom: 1px solid var(--border-color);
  padding-top: 5px;
  padding-bottom: 5px;

  > .label {
    color: var(--text-color-2);
    font-size: 1rem;
    font-weight: 400;
  }

  > .value {
    font-size: 1rem;
    font-weight: 600;
  }
`;
