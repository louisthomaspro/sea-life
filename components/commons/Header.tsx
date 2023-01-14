import styled from "styled-components";
import BackButton from "./BackButton";

interface IHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  noBackground?: boolean;
  shadow?: boolean;
  fixed?: boolean;
}
export default function Header(props: IHeaderProps) {
  return (
    <Style {...props} className={`${props.className} sm:px-0`}>
      <div className="flex" style={{ width: "42px" }}>
        {props.showBackButton && (
          <>
            <BackButton />
            <div>{props.children}</div>
          </>
        )}
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
  position: ${({ fixed }) => (fixed ? "fixed" : "relative")};
  top: 0;
  z-index: 100;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: var(--global-padding);
  padding-right: var(--global-padding);
  border-bottom: ${({ shadow }) =>
    shadow ? "1px solid var(--border-color-light)" : "none"};
  background-color: ${({ noBackground }) =>
    noBackground ? "transparent" : " #ffffff"};

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
