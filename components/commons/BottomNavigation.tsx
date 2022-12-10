import styled from "styled-components";
import Link from "next/link";

interface IBottomNavigation {}
export default function BottomNavigation(props: IBottomNavigation) {
  return (
    <Style {...props}>
      <Link href="/explore">Explore</Link>
      <Link href="/search">Search</Link>
      {/* <Link href="/profile">Profile</Link> */}
    </Style>
  );
}

// Style
const Style = styled.nav<IBottomNavigation>`
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-left: var(--global-padding);
  padding-right: var(--global-padding);
  background-color: #ffffff;
`;
