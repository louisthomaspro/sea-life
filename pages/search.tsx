import { NextPage } from "next";
import BottomNavigation from "../components/commons/BottomNavigation";
import Header from "../components/commons/Header";

const Search: NextPage = () => {
  return (
    <>
      <Header title="Rechercher" fixed/>
      <div className="main-container">
        Contenu de rechercher
      </div>
      <BottomNavigation />
    </>
  );
};

export default Search;
