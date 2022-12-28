import Image from "next/image";
import Link from "next/link";
import { blurDataURL, firebaseStorageLoader } from "../../utils/helper";
import FrFlagSvg from "../../public/icons/flags/FR.svg";
import GbFlagSvg from "../../public/icons/flags/GB.svg";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import { ISpecies } from "../../types/Species";
import { useInView } from "react-cool-inview";
import { useState } from "react";

export default function SpeciesCard(props: { species: ISpecies }) {
  const [display, setDisplay] = useState(false);

  const { observe } = useInView({
    delay: 100,
    onEnter: () => {
      setDisplay(true);
    },
    onLeave: () => {
      setDisplay(false);
    },
  });

  return (
    <m.div
      whileTap={{
        scale: tapAnimationDuration,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      <Style>
        <div className="useInView" ref={observe}></div>
        {display ? (
          <Link href={`/species/${props.species.id}`} className="container">
            <div className="img-wrapper">
              {props.species?.photos?.[0]?.original_url && (
                <Image
                  src={props.species?.photos?.[0]?.original_url}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="50vw"
                  alt={props.species.scientific_name}
                />
              )}
            </div>
            <div className="content">
              {props.species.common_name.fr && (
                <div className="title">
                  <div>
                    <FrFlagSvg width="12px" />
                  </div>
                  <span className="ml-1">{props.species.common_name.fr}</span>
                </div>
              )}
              {props.species.common_name.en && (
                <div className="title">
                  <div>
                    <GbFlagSvg width="12px" />
                  </div>
                  <span className="ml-1">{props.species.common_name.en}</span>
                </div>
              )}
              <div className="scientific-name">
                {props.species.scientific_name}
              </div>
            </div>
          </Link>
        ) : (
          <></>
        )}
      </Style>
    </m.div>
  );
}

// Style
const Style = styled.div`
  width: 100%;
  aspect-ratio: 2 / 2.3;
  background-color: var(--bg-grey);
  border-radius: var(--border-radius);
  padding: 6px;
  position: relative;

  .useInView {
    border: transparent 1px solid;
    position: absolute;
    height: 100%;
    top: 0;
    bottom: 0;
    margin: auto 0;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 100%;

    .img-wrapper {
      /* flex-grow: 1; */
      width: 100%;
      position: relative;
      height: 100%;
      border-radius: var(--border-radius);
      overflow: hidden;
    }

    .content {
      padding: 0px 6px;
      margin-top: 4px;

      .title {
        font-size: 13px;
        font-weight: bold;
        display: flex;
        align-items: center;

        > span {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .scientific-name {
        font-size: 12px;
        font-style: italic;
        color: var(--text-color-2);

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;
