import styled from "styled-components";
import { m } from "framer-motion";
import { shader } from "../../utils/helper";
import { whileTapAnimationIconButton } from "../../constants/config";
interface IRoundButtonProps {
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  ariaLabel: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export default function RoundButton(props: IRoundButtonProps) {
  return (
    <Style className={props.className}>
      <m.button
        aria-label={props.ariaLabel}
        whileTap={whileTapAnimationIconButton}
        onClick={props.onClick}
      >
        {props.children}
      </m.button>
    </Style>
  );
}

// Style
const Style = styled.div`
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
