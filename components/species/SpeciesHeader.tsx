import styled from "styled-components";
import { ISpecies } from "../../types/Species";
import { m } from "framer-motion";
import { whileTapAnimationIconButton } from "../../constants/config";

// svg
import HeartSvg from "../../public/icons/fontawesome/light/heart.svg";
import ShareNodesSvg from "../../public/icons/fontawesome/light/share-nodes.svg";

export default function SpeciesHeader(props: { species: ISpecies }) {
  return (
    <Style>
      <m.button whileTap={whileTapAnimationIconButton} onClick={() => {}}>
        <HeartSvg
          aria-label="favorite"
          className="svg-icon"
          style={{ width: "21px", marginLeft: "1px" }}
        />
      </m.button>
      <m.button
        whileTap={whileTapAnimationIconButton}
        onClick={() => {
          if (navigator.share) {
            navigator.share({
              url: location.href,
              title: document.title,
            });
          } else {
            console.error("Error sharing");
          }
        }}
      >
        <ShareNodesSvg className="svg-icon flex" style={{ width: "20px" }} />
      </m.button>
    </Style>
  );
}

// Style
const Style = styled.div`
  position: absolute;
  top: 0;
  right: var(--global-padding);
  z-index: 1;
  display: flex;
  gap: 8px;
  height: 60px;
  align-items: center;

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    cursor: pointer;
    background-color: #ffffff;
  }
`;
