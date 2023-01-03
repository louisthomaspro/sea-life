import Image from "next/image";
import Link from "next/link";
import {
  blurDataURL,
  capitalizeFirstLetter,
  capitalizeWords,
  firebaseStorageLoader,
} from "../../utils/helper";
import FrFlagSvg from "../../public/icons/flags/FR.svg";
import GbFlagSvg from "../../public/icons/flags/GB.svg";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import { ISpecies } from "../../types/Species";
import { useInView } from "react-cool-inview";
import { useState } from "react";
import { BlurhashCanvas } from "react-blurhash";

export default function SpeciesCard(props: { species: ISpecies }) {
  const [display, setDisplay] = useState(false);

  console.log(props.species)

  const { observe } = useInView({
    rootMargin: "100% 0px",
    // threshold: 1,
    root: null,
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
        <div className="useInView" id="use" ref={observe}></div>
        {display ? (
          <Link href={`/species/${props.species.id}`} className="container">
            <div className="img-wrapper">
              {props.species?.photos?.[0]?.blurhash && (
                <BlurhashCanvas
                  {...props.species.photos[0].blurhash}
                  punch={1}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}
              <Image
                src={
                  props.species?.photos?.[0]?.original_url ??
                  "/img/no-image.svg"
                }
                fill
                style={{ objectFit: "cover" }}
                sizes="50vw"
                alt={props.species.scientific_name}
              />
            </div>
            <div className="content">
              {props.species.common_names?.fr?.length > 0 && (
                <div className="title">
                  <div>
                    <FrFlagSvg width="12px" />
                  </div>
                  <span className="ml-1">{capitalizeWords(props.species.common_names.fr[0])}</span>
                </div>
              )}
              {props.species.common_names?.en?.length > 0 && (
                <div className="title">
                  <div>
                    <GbFlagSvg width="12px" />
                  </div>
                  <span className="ml-1">{capitalizeWords(props.species.common_names.en[0])}</span>
                </div>
              )}
              <div className="scientific-name">
                {capitalizeFirstLetter(props.species.scientific_name)}
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

  @keyframes append-animate {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

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
    opacity: 1;
    /* animation: append-animate 0.1s linear; */

    .img-wrapper {
      /* flex-grow: 1; */
      width: 100%;
      position: relative;
      height: 100%;
      border-radius: var(--border-radius);
      overflow: hidden;

      img {
        animation: append-animate 0.1s linear;
      }
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
