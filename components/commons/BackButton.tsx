import styled from "styled-components";
import { m } from "framer-motion";
import ArrowLeftSvg from "../../public/icons/fontawesome/light/arrow-left.svg";
import { whileTapAnimationIconButton } from "../../constants/config";
import { useRouter } from "next/router";
import { useHistory } from "../../context/history.context";

interface IBackButtonProps {
  disabled?: boolean;
}
export default function BackButton(props: IBackButtonProps) {
  const router = useRouter();
  const { history, back } = useHistory();

  const backClick = () => {
    router.back();
    // if (history.length > 1) {
    //   back();
    // } else {
    //   router.push("/");
    // }
  };

  return (
    <Style>
      <m.button whileTap={whileTapAnimationIconButton} onClick={backClick}>
        <ArrowLeftSvg
          aria-label="Back"
          className="svg-icon"
          style={{ height: "22px" }}
        />
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
