import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import CustomSearchBox from "../search/CustomSearchBox";

import UserSvg from "../../public/icons/fontawesome/light/user.svg";
import GlobeSvg from "../../public/icons/fontawesome/light/globe.svg";

interface IHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export default function WebHeader(props: IHeaderProps) {
  return (
    <Style {...props}>
      <div className="web-header-container max-width-800">
        <div>
          <Link href="/" className="flex">
            <Image
              src="/icon-192x192.png"
              width={45}
              height={45}
              alt="sea-life-logo"
              style={{ marginRight: "10px" }}
            />
          </Link>
          <ul className="nav-links">
            <li>
              <Link href="/explore">Explore</Link>
            </li>
          </ul>
        </div>

        <CustomSearchBox />

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
      gap: 1.4rem;
    }
  }

  .nav-links li {
    text-decoration: underline;
    font-weight: 600;
  }

  .profile-button {
    border: 1px solid #ccc;
    border-radius: 100px;
    padding: 6px 12px;
    display: flex;
  }
`;
