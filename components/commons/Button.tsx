import styled from "styled-components";
import { m } from "framer-motion";
import { shader } from "../../utils/helper";
interface IButtonProps {
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  disabled?: boolean;
  icon?: boolean;
  iconWidth?: string;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export default function Button(props: IButtonProps) {
  return (
    <Style
      className={props.className}
      aria-label={props["aria-label"]}
      iconWidth={props.iconWidth}
      icon={props.icon}
    >
      <m.button
        whileTap={{
          backgroundColor: shader(
            getComputedStyle(document.documentElement)
              .getPropertyValue("--primary-color")
              .trim(),
            -0.2
          ),
          transition: { duration: 0.1, ease: "easeInOut" },
        }}
        onClick={props.onClick}
      >
        {props.children}
      </m.button>
    </Style>
  );
}

// Style
const Style = styled.div<IButtonProps>`
  button {
    display: flex;
    padding: 0 10px;
    color: #ffffff;
    background: var(--primary-color);
    border-radius: var(--border-radius);
    height: 50px;
    align-items: center;
    justify-content: center;
    width: ${(props) => (props?.icon ? "50px" : "auto")};
    cursor: pointer;

    svg {
      width: ${(props) => props?.iconWidth ?? "22px"};

      path {
        fill: #ffffff;
      }
    }
  }
`;
