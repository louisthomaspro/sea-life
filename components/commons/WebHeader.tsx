import Image from "next/image";
import Link from "next/link";
import { Configure, InstantSearch } from "react-instantsearch-hooks-web";
import styled from "styled-components";
import { algolia } from "../../algolia/clientApp";
import CustomSearchBox from "../search/CustomSearchBox";

import UserSvg from "../../public/icons/fontawesome/light/user.svg";
import GlobeSvg from "../../public/icons/fontawesome/light/globe.svg";
import { useWindowSize } from "../../hooks/useWindowSize";

interface IHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  noBackground?: boolean;
  shadow?: boolean;
  fixed?: boolean;
}
export default function WebHeader(props: IHeaderProps) {
  const { width } = useWindowSize();

  return (
    <Style {...props}>
      <div className="content">
        <div className="left">
          <Link href="/" className="flex">
            <Image
              src="/icon-192x192.png"
              width={45}
              height={45}
              alt="sea-life-logo"
              style={{ marginRight: "10px" }}
            />
          </Link>
          <ul>
            <li>
              <Link href="/explore">Explore</Link>
            </li>
          </ul>
        </div>

        <CustomSearchBox />

        <div className="right">
          {/* <GlobeSvg
            aria-label="language"
            className="svg-icon"
            style={{ height: "18px" }}
          />
          <div className="profile">
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
  position: ${({ fixed }) => (fixed ? "fixed" : "relative")};
  padding-left: var(--global-padding);
  padding-right: var(--global-padding);
  border-bottom: 1px solid var(--border-color-light);

  > .content {
    max-width: 800px;
    margin: auto;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: space-between;

    > div {
      display: flex;
      align-items: center;
      gap: 1.4rem;
    }
  }

  ul li {
    text-decoration: underline;
    font-weight: 600;
  }

  .profile {
    border: 1px solid #ccc;
    border-radius: 100px;
    padding: 6px 12px;
    display: flex;
  }
`;
