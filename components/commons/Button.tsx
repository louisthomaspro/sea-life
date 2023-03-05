import styled from "styled-components";
import { HTMLMotionProps, m } from "framer-motion";
import { shader } from "../../utils/helper";

interface IButtonProps extends HTMLMotionProps<"button"> {
  primary?: boolean;
  $outline?: boolean;
  "aria-label"?: string;
}

const Button = (props: IButtonProps) => {
  return (
    <ButtonStyle
      className={props.className}
      onClick={props.onClick}
      {...props}
      // whileTap={{
      //   backgroundColor: shader(
      //     getComputedStyle(document.documentElement)
      //       .getPropertyValue("--primary-color")
      //       .trim(),
      //     props.$outline ? 1 : -0.2
      //   ),
      //   transition: { duration: 0.1, ease: "easeInOut" },
      // }}
    >
      {props.children}
    </ButtonStyle>
  );
};

Button.displayName = "CustomButton";
export default Button;

const ButtonStyle = styled(m.button)<IButtonProps>`
  background-color: ${(props) => (props.$outline ? "transparent" : "white")};
  color: ${(props) => (props.$outline ? "var(--text-color)" : "white")};
  border: ${(props) => (props.$outline ? "1px solid" : "none")};
  border-color: var(--text-color);
  border-radius: 10px;
  padding: 0.8rem 0.8rem;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  background-color: ${(props) => (props.$outline ? "white" : "#282828")};
`;
