import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import BackButton from "../../../components/commons/BackButton";
import MyButton from "../../../components/commons/MyButton";
import { withAuthServerSideProps } from "../../../firebase/withAuth";
import {
  getAllDeletedSpecies,
  restoreSpeciesById,
} from "../../../utils/firestore/species.firestore";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ISpecies } from "../../../types/Species";

const DeletedSpecies: NextPage = () => {
  const [deletedSpecies, setDeletedSpecies] = useState<any[]>([]);

  useEffect(() => {
    getAllDeletedSpecies().then((species) => {
      setDeletedSpecies(species);
    });
  }, []);

  const restoreColumn = (rowData: ISpecies) => {
    return (
      <MyButton
        outline
        onClick={() => {
          restoreSpeciesAction(rowData);
        }}
      >
        Restaurer
      </MyButton>
    );
  };

  const restoreSpeciesAction = (species: ISpecies) => {
    restoreSpeciesById(species.id).then(async () => {
      await getAllDeletedSpecies().then((speciesList) => {
        setDeletedSpecies(speciesList);
      });
    });
  };

  return (
    <div className="max-width-800">
      <div className="global-padding">
        <BackButton className="pt-2" />
      </div>
      <div className="mt-3">
        <div>
          <div className="card">
            <DataTable value={deletedSpecies} responsiveLayout="scroll">
              <Column
                field="scientific_name"
                header="Nom scientifique"
              ></Column>
              <Column body={restoreColumn} header="Restore"></Column>
            </DataTable>
          </div>
        </div>
      </div>
    </div>
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

    return {
      props: {},
    };
  }
);

export default DeletedSpecies;
