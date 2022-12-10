import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import dynamic from "next/dynamic";
import { m } from "framer-motion";

// Svg
import CircleUserSvg from "../../public/icons/fontawesome/light/circle-user.svg";
import HomeSvg from "../../public/icons/fontawesome/light/home.svg";
import ArrowLeftSvg from "../../public/icons/fontawesome/light/arrow-left.svg";
import Link from "next/link";
import { whileTapAnimationIconButton } from "../../constants/config";

const DynamicProfileSideBar = dynamic(
  () => import("../commons/ProfileSideBar")
);

interface IHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showProfileButton?: boolean;
  noBackground?: boolean;
  shadow?: boolean;
}
export default function Header(props: IHeaderProps) {
  const [profileVisible, setProfileVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <DynamicProfileSideBar
        visible={profileVisible}
        position="right"
        onHide={() => setProfileVisible(false)}
        showCloseIcon={false}
      />
      <Style {...props}>
        <div className="flex" style={{ width: "42px" }}>
          {props.showBackButton && (
            <m.button
              whileTap={whileTapAnimationIconButton}
              onClick={() => {
                router.push(
                  router.asPath.substring(0, router.asPath.lastIndexOf("/"))
                );
              }}
            >
              <ArrowLeftSvg
                aria-label="Back"
                className="svg-icon"
                style={{ height: "22px" }}
              />
            </m.button>
          )}
        </div>
        <div className="title flex align-items-center justify-content-center">
          {props.title}
        </div>
        <div className="flex" style={{ width: "42px" }}>
          {props.showHomeButton && (
            <Link href="/">
              <m.button whileTap={whileTapAnimationIconButton}>
                <HomeSvg
                  aria-label="Home"
                  className="svg-icon"
                  style={{ width: "22px" }}
                />
              </m.button>
            </Link>
          )}
          {props.showProfileButton && (
            <m.button
              whileTap={whileTapAnimationIconButton}
              onClick={() => setProfileVisible(true)}
            >
              <CircleUserSvg
                aria-label="Profile"
                className="svg-icon"
                style={{ width: "22px" }}
              />
            </m.button>
          )}
        </div>
      </Style>
    </>
  );
}

// Style
const Style = styled.div<IHeaderProps>`
  height: 60px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-left: var(--global-padding);
  padding-right: var(--global-padding);
  box-shadow: ${({ shadow }) =>
    shadow ? "0px 0px 1px rgba(0, 0, 0, 0.25)" : "none"};
  margin-bottom: 1rem;
  background-color: ${({ noBackground }) =>
    noBackground ? "transparent" : " #ffffff"};

  .title {
    font-size: 24px;
    font-weight: bold;
    color: var(--text-color-1);
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    cursor: pointer;
    background-color: #ffffff;
    /* border: 1px solid black; */
  }
`;
