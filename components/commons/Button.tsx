import styled from "styled-components";
import { m } from "framer-motion";
import { shader } from "../../utils/helper";
import { forwardRef, Ref } from "react";
interface IButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  disabled?: boolean;
  icon?: boolean;
  "icon-width"?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}
const Button = forwardRef(
  (props: IButtonProps, ref: Ref<HTMLButtonElement>) => {
    return (
      <Style
        as={m.button}
        className={props.className}
        style={props.style}
        aria-label={props["aria-label"]}
        icon-width={props["icon-width"]}
        icon={props.icon}
        ref={ref}
        whileTap={{
          backgroundColor: shader(
            getComputedStyle(document.documentElement)
              .getPropertyValue("--button-primary-color")
              .trim(),
            -0.2
          ),
          transition: { duration: 0.1, ease: "easeInOut" },
        }}
        onClick={props.onClick}
      >
        {props.children}
      </Style>
    );
  }
);

Button.displayName = "CustomButton";
export default Button;

// Style
const Style = styled.button<IButtonProps>`
  display: flex;
  padding: 0 10px;
  color: #ffffff;
  background: var(--button-primary-color);
  border-radius: var(--border-radius);
  height: 50px;
  align-items: center;
  justify-content: center;
  width: ${(props) => (props?.icon ? "50px" : "auto")};
  cursor: pointer;

  svg {
    width: ${(props) => props?.["icon-width"] ?? "22px"};

    path {
      fill: #ffffff;
    }
  }
`;
