import { useContext, useEffect, useState } from "react";
import BottomNavigation from "../components/commons/BottomNavigation";
import { GoogleSignIn, GoogleSignOut } from "../components/commons/GoogleAuth";
import Header from "../components/commons/Header";
import AuthContext from "../context/auth.context";
import { Dropdown } from "primereact/dropdown";
import styled from "styled-components";

const regionsList = [
  { name: "Toutes les régions", code: "all" },
  { name: "Mer Méditerranée", code: "mediterranean-sea" },
];

const Profile = () => {
  const { userSession, userData } = useContext(AuthContext);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const onRegionChange = (e: any) => {
    setSelectedRegion(e.value);
    localStorage.setItem("selectedRegion", e.value);
  };

  useEffect(() => {
    if (window.localStorage.getItem("selectedRegion")) {
      setSelectedRegion(localStorage.getItem("selectedRegion"));
    } else {
      setSelectedRegion(regionsList[0].code);
      localStorage.setItem("selectedRegion", regionsList[0].code);
    }
  }, []);

  return (
    <>
      <Header title="Profile" />
      <div className="main-container">
        <Style>
          {/* <div className="mb-3 mt-3">
          {userData && <>Hello {userSession.displayName} </>}
        </div>
        <div>{userSession ? <GoogleSignOut /> : <GoogleSignIn />}</div> */}

          <div className="field">
            <label>Région</label>
            <Dropdown
              value={selectedRegion}
              options={regionsList}
              onChange={onRegionChange}
              optionLabel="name"
              optionValue="code"
              placeholder="Select a City"
            />
          </div>
        </Style>
      </div>
      <BottomNavigation />
    </>
  );
};

export default Profile;

// Style
const Style = styled.div`
  .field {
    display: flex;
    flex-direction: column;
    max-width: 250px;
  }
`;
