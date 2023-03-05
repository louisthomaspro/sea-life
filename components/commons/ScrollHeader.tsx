import { useEffect, useState } from "react";
import styled from "styled-components";
import BackButton from "./BackButton";

interface IHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
}
export default function ScrollHeader(props: IHeaderProps) {
  const [showScrollHeader, setShowScrollHeader] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setShowScrollHeader(true);
    } else {
      setShowScrollHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Style
      {...props}
      className={`${props.className} transition fixed sm:hidden ${
        showScrollHeader ? "opacity-100 z-5" : "opacity-0 z-0"
      }`}
    >
      <div className="flex" style={{ width: "42px" }}>
        <BackButton />
      </div>
      <div className="title flex align-items-center justify-content-center">
        {props.title}
      </div>
      <div className="flex" style={{ width: "42px" }}></div>
    </Style>
  );
}

// Style
const Style = styled.header<IHeaderProps>`
  height: 60px;
  top: 0;
  z-index: 100;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: var(--global-padding);
  padding-right: var(--global-padding);
  background-color: #ffffff;

  transition: all 0.1s ease-in-out;

  .title {
    font-size: 24px;
    line-height: 24px;
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
