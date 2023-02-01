import styled from "styled-components";
import { HTMLMotionProps, m } from "framer-motion";
import { shader } from "../../utils/helper";

interface IButtonProps extends HTMLMotionProps<"button"> {
  primary?: boolean;
  outline?: boolean;
  "aria-label"?: string;
}

const Button = (props: IButtonProps) => {
  return (
    <ButtonStyle
      className={props.className}
      onClick={props.onClick}
      primary={props.primary}
      whileTap={{
        backgroundColor: shader(
          getComputedStyle(document.documentElement)
            .getPropertyValue("--primary-color")
            .trim(),
          props.outline ? 1 : -0.2
        ),
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      {props.children}
    </ButtonStyle>
  );
};

Button.displayName = "CustomButton";
export default Button;

const ButtonStyle = styled(m.button)<IButtonProps>`
  background-color: ${(props) => (props.outline ? "transparent" : "white")};
  color: var(--primary-color);
  border: ${(props) => (props.outline ? "1px solid" : "none")};
  border-color: var(--primary-color);
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
`;
