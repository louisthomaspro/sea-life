import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import styled from "styled-components";
import Header from "../../../components/commons/Header";
import { withAuthServerSideProps } from "../../../firebase/withAuth";
import { ISpecies } from "../../../types/Species";

const Edit: NextPage<{
  species: ISpecies;
}> = ({ species }) => {
  return (
    <Style className="max-width-800">
      <Header title={"Edit"} showBackButton />
      <div className="global-padding pt-0">
        <div>Coming soon...</div>
      </div>
    </Style>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(
  async (context: GetServerSidePropsContext, decodedToken: any) => {
    if (!decodedToken || !decodedToken?.isAdmin) {
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
