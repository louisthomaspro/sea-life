import { useContext, useEffect, useState } from "react";
import { NextPage } from "next";
import BottomNavigation from "../components/commons/BottomNavigation";
import { GoogleSignIn, GoogleSignOut } from "../components/commons/GoogleAuth";
import Header from "../components/commons/Header";
import AuthContext from "../context/auth.context";
import { Dropdown } from "primereact/dropdown";
import styled from "styled-components";
import RegionDropdown from "../components/commons/RegionDropdown";

const Profile: NextPage = () => {
  const { userSession, userData } = useContext(AuthContext);

  return (
    <>
      <Header title="Profile" fixed />
      <div className="main-container">
        <Style>
          Contenu de profile
          {/* <RegionDropdown /> */}
          {/* <div className="mb-3 mt-3">
          {userData && <>Hello {userSession.displayName} </>}
        </div>
        <div>{userSession ? <GoogleSignOut /> : <GoogleSignIn />}</div> */}
        </Style>
      </div>
      <BottomNavigation />
    </>
  );
};

export default Profile;

// Style
const Style = styled.div``;
