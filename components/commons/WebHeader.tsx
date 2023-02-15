import Link from "next/link";
import styled from "styled-components";
import dynamic from "next/dynamic";

import LogoFullSvg from "../../public/icons/logos/logo-full.svg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DynamicCustomSearchBox = dynamic(
  () => import("../../components/search/CustomSearchBox")
);

interface IHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function WebHeader(props: IHeaderProps) {
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
      <div className="web-header-container max-width-800">
        <div>
          <Link href="/" className="flex">
            <LogoFullSvg
              aria-label="sealife"
              style={{ height: "35px", marginRight: "10px" }}
            />
          </Link>
          <ul className="nav-links mr-3">
            <li className={activeMenu === "explore" ? "active" : null}>
              <Link href="/explore">Accueil</Link>
            </li>
            <li className={activeMenu === "profile" ? "active" : null}>
              <Link href="/profile">Compte</Link>
            </li>
          </ul>
        </div>

        <DynamicCustomSearchBox screen="web" />

        <div>
          {/* <GlobeSvg
            aria-label="language"
            className="svg-icon"
            style={{ height: "18px" }}
          />
          <div className="profile-button">
            <UserSvg
              aria-label="language"
              className="svg-icon"
              style={{ height: "16px" }}
            />
          </div> */}
        </div>
      </div>
    </Style>
  );
}

// Style
const Style = styled.header<IHeaderProps>`
  height: 90px;
  padding-left: var(--global-padding);
  padding-right: var(--global-padding);
  border-bottom: 1px solid var(--border-color-light);

  .web-header-container {
    display: flex;
    height: 100%;
    justify-content: space-between;

    > div {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
  }

  .nav-links {
    display: flex;
    gap: 16px;

    li {
      font-weight: 600;

      &.active {
        text-decoration: underline;
      }
    }
  }

  .profile-button {
    border: 1px solid #ccc;
    border-radius: 100px;
    padding: 6px 12px;
    display: flex;
  }
`;
