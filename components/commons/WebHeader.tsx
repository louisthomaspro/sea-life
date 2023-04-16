import Link from "next/link";
import styled from "styled-components";
import dynamic from "next/dynamic";

import LogoFullSvg from "../../public/icons/logos/logo-full.svg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const DynamicCustomSearchBox = dynamic(
  () => import("../../components/search/CustomSearchBox")
);

const activeRoutes = ["explore", "search", "profile"];

interface IHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function WebHeader(props: IHeaderProps) {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState<string>();

  useEffect(() => {
    const slug = router.asPath.split("/")[1];
    if (activeRoutes.includes(slug)) {
      setActiveMenu(slug);
    }
  }, [router.asPath]);

  return (
    <WebHeaderContainer className="max-width-800 justify-content-between hidden sm:flex">
      <div className="flex align-items-center gap-5">
        <Link href="/" className="flex">
          <LogoFullSvg
            aria-label="sealife"
            style={{ height: "33px", marginRight: "10px" }}
          />
        </Link>
        <ul className="flex gap-3 mr-3">
          <MenuItem $active={activeMenu === "explore"}>
            <Link href="/explore">Accueil</Link>
          </MenuItem>
          <MenuItem $active={activeMenu === "profile"}>
            <Link href="/profile">Compte</Link>
          </MenuItem>
        </ul>
      </div>

      <DynamicCustomSearchBox className="flex" />

      <div></div>
    </WebHeaderContainer>
  );
}

// Style
const WebHeaderContainer = styled.header<IHeaderProps>`
  height: 90px;
  padding-left: var(--global-padding);
  padding-right: var(--global-padding);
  border-bottom: 1px solid var(--border-color-light);
`;

const MenuItem = styled.li<{ $active?: boolean }>`
  font-weight: 600;
  text-decoration: ${(props) => (props.$active ? "underline" : "none")};
`;
