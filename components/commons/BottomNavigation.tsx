import styled from "styled-components";
import Link from "next/link";

// svg
import Grid2Svg from "../../public/icons/fontawesome/light/grid-2.svg";
import MagnifyingGlassSvg from "../../public/icons/fontawesome/light/magnifying-glass.svg";
import UserSvg from "../../public/icons/fontawesome/solid/user.svg";
import HouseSvg from "../../public/icons/fontawesome/solid/house.svg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { whileTapAnimationIconButton } from "../../constants/config";

interface IBottomNavigation {}
export default function BottomNavigation(props: IBottomNavigation) {
  const router = useRouter();

  const [activeMenu, setActiveMenu] = useState<string>();

  useEffect(() => {
    const slug = router.asPath.split("/")[1];
    if (["explore", "search", "profile"].includes(slug)) {
      setActiveMenu(slug);
    }
  }, [router.asPath]);

  return (
    <Style {...props} className="sm:hidden">
      <div className="grid grid-nogutter h-full align-items-center container">
        <Link href="/explore">
          <NavigationButton
            className={activeMenu === "explore" && "active"}
            aria-label="Favorite"
          >
            <HouseSvg
              aria-label="profile"
              className="svg-icon"
              style={{ width: "19px", marginLeft: "1px" }}
            />
            <div className="label">Accueil</div>
          </NavigationButton>
        </Link>
        <Link href="/profile">
          <NavigationButton
            className={activeMenu === "profile" && "active"}
            aria-label="Favorite"
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
    </Style>
  );
}

// Style
const Style = styled.nav<IBottomNavigation>`
  height: var(--bottom-navigation-height);
  position: fixed;
  bottom: 0;
  z-index: 101;
  width: 100%;

  box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.25);
  padding: 0 2rem;
  background-color: #ffffff;

  .container {
    max-width: 400px;
    margin: auto;

    a {
      margin: auto;
    }
  }
`;

const NavigationButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  position: relative;
  overflow: hidden;
  padding: 10px 20px;
  border-radius: 100px;

  .label {
    font-size: 0.9rem;
    z-index: 2;
  }

  svg.svg-icon {
    z-index: 2;
    padding-top: 2px;

    path {
      fill: #bccbd7;
    }
  }
  .label {
    color: var(--text-color-1);
  }

  &.active {
    svg.svg-icon {
      path {
        fill: var(--primary-color);
      }
    }
    .label {
      color: var(--primary-color);
    }
  }
`;
