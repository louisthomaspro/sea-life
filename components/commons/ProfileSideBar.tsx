import Link from "next/link";
import { Sidebar, SidebarProps } from "primereact/sidebar";
import { useContext } from "react";
import styled from "styled-components";
import AuthContext from "../../context/auth.context";
import Button from "./Button";
import { GoogleSignIn, GoogleSignOut } from "./GoogleAuth";

export default function ProfileSideBar(props: SidebarProps) {
  const { userSession, userData } = useContext(AuthContext);

  return (
    <Sidebar {...props}>
      <Style>
        <h1>Profile</h1>
        <div>
          <div className="mb-3 mt-3">
            {userData && <>Hello {userSession.displayName} </>}
          </div>
          {userData?.isAdmin && (
            <>
              <Link href="/admin">
                <Button className="mb-3" aria-label="Admin">
                  Admin
                </Button>
              </Link>
            </>
          )}
          <div>{userSession ? <GoogleSignOut /> : <GoogleSignIn />}</div>
        </div>
      </Style>
    </Sidebar>
  );
}

// Style
const Style = styled.div`
  h1 {
    font-size: 20px;
    font-weight: bold;
  }
`;
