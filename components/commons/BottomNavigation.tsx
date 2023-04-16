import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// svg
import UserSvg from "../../public/icons/fontawesome/solid/user.svg";
import HouseSvg from "../../public/icons/fontawesome/solid/house.svg";

const activeRoutes = ["explore", "search", "profile"];

interface IBottomNavigation extends React.HTMLAttributes<HTMLDivElement> {}
export default function BottomNavigation(props: IBottomNavigation) {
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState<string>();

  useEffect(() => {
    const slug = router.asPath.split("/")[1];
    if (activeRoutes.includes(slug)) {
      setActiveMenu(slug);
    }
  }, [router.asPath]);

  return (
    <BottomNavigationContainer {...props} className="sm:hidden">
      <div className="grid grid-nogutter h-full align-items-center container max-w-25rem m-auto">
        <Link href="/explore" className="m-auto">
          <NavigationButton
            $active={activeMenu === "explore"}
            aria-label="home"
          >
            <HouseSvg
              aria-label="home"
              className="svg-icon"
              style={{ width: "19px", marginLeft: "1px" }}
            />
            <div className="label">Accueil</div>
          </NavigationButton>
        </Link>
        <Link href="/profile" className="m-auto">
          <NavigationButton
            $active={activeMenu === "profile"}
            aria-label="profile"
          >
            <UserSvg
              aria-label="profile"
              className="svg-icon"
              style={{ width: "16px", marginLeft: "1px" }}
            />
            <div className="label">Compte</div>
          </NavigationButton>
        </Link>
      </div>
    </BottomNavigationContainer>
  );
}

// Style
const BottomNavigationContainer = styled.nav<IBottomNavigation>`
  height: var(--bottom-navigation-height);
  position: fixed;
  bottom: 0;
  z-index: 101;
  width: 100%;
  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.25);
  padding: 0 2rem;
  background-color: #ffffff;
`;

const NavigationButton = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  position: relative;
  padding: 10px 20px;
  cursor: pointer;

  .label {
    font-size: 0.9rem;
    z-index: 2;
    color: ${(props) => (props.$active ? "var(--primary-color)" : "#bccbd7")};
  }

  svg.svg-icon {
    z-index: 2;
    padding-top: 2px;

    path {
      fill: ${(props) => (props.$active ? "var(--primary-color)" : "#bccbd7")};
    }
  }
`;
