import { NextPage } from "next";
import BottomNavigation from "../components/commons/BottomNavigation";
import styled from "styled-components";

const Profile: NextPage = () => {
  // const { userSession, userData } = useContext(AuthContext);

  return (
    <>
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
