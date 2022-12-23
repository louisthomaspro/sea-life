import styled from "styled-components";
import Link from "next/link";
import RoundButton from "./RoundButton";

// svg
import Grid2Svg from "../../public/icons/fontawesome/light/grid-2.svg";
import MagnifyingGlassSvg from "../../public/icons/fontawesome/light/magnifying-glass.svg";
import UserSvg from "../../public/icons/fontawesome/light/user.svg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

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
    <Style {...props}>
      <div className="grid grid-nogutter h-full align-items-center container">
        <Link href="/explore">
          <div className="col item">
            <a>
              <RoundButton
                ariaLabel="Favorite"
                className={activeMenu === "explore" && "active"}
              >
                <Grid2Svg
                  aria-label="explore"
                  className="svg-icon"
                  style={{ width: "18px", marginLeft: "1px" }}
                />
              </RoundButton>
            </a>
          </div>
        </Link>
        <Link href="/search">
          <div className="col item">
            <a>
              <RoundButton
                ariaLabel="Favorite"
                className={activeMenu === "search" && "active"}
              >
                <MagnifyingGlassSvg
                  aria-label="search"
                  className="svg-icon"
                  style={{ width: "18px", marginLeft: "1px" }}
                />
              </RoundButton>
            </a>
          </div>
        </Link>
        <Link href="/profile">
          <div className="col item">
            <a>
              <RoundButton
                ariaLabel="Favorite"
                className={activeMenu === "profile" && "active"}
              >
                <UserSvg
                  aria-label="profile"
                  className="svg-icon"
                  style={{ width: "17px", marginLeft: "1px" }}
                />
              </RoundButton>
            </a>
          </div>
        </Link>
      </div>
    </Style>
  );
}

// Style
const Style = styled.nav<IBottomNavigation>`
  border-top: 1px solid #eaeaea;
  height: 60px;
  width: 100%;
  padding-left: var(--global-padding);
  padding-right: var(--global-padding);
  background-color: #ffffff;
  border-top: 1px solid var(--border-color);

  .container {
    max-width: 400px;
    margin: auto;

    .item {
      display: flex;
      justify-content: center;
    }
  }

  .active {
    svg.svg-icon {
      path {
        fill: var(--primary-color);
      }
    }
  }
`;
