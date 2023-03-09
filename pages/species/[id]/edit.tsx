import { NextPage } from "next";
import styled from "styled-components";
import Header from "../../../components/commons/Header";
import { ISpecies } from "../../../types/Species";
import { withSessionSsr } from "../../../iron-session/withSession";

const Edit: NextPage<{
  species: ISpecies;
}> = ({ species }) => {
  return (
    <Style className="max-width-800">
      <Header title={"Edit"} showBackButton />

      <div>Coming soon...</div>
    </Style>
  );
};

export const getServerSideProps = withSessionSsr(async function ({ req, res }) {

  return {
    props: {
      user: req.session.user ?? null,
    },
  };
});

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