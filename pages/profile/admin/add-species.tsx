import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import BackButton from "../../../components/commons/BackButton";
import MyButton from "../../../components/commons/MyButton";
import { withAuthServerSideProps } from "../../../firebase/withAuth";

const AddSpecies: NextPage = () => {
  const [value, setValue] = useState<string>("");

  return (
    <div className="global-padding">
      <BackButton className="pt-2" />
      <div className="mt-3">
        <div className="flex flex-column">
          <label htmlFor="scientific_name" className="mb-1">
            Nom scientific
          </label>
          <InputText
            id="scientific_name"
            name="scientific_name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mb-2"
          />
          <MyButton primary>Chercher</MyButton>
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

export default AddSpecies;
