import Image from "next/image";
import Link from "next/link";
import { capitalizeFirstLetter, capitalizeWords } from "../../utils/helper";
import FrFlagSvg from "../../public/icons/flags/FR.svg";
import GbFlagSvg from "../../public/icons/flags/GB.svg";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import { ISpecies } from "../../types/Species";
import { useInView } from "react-cool-inview";
import { useState } from "react";
import { BlurhashCanvas } from "react-blurhash";

export default function SpeciesCard(props: {
  species: ISpecies;
  index?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const { observe, inView } = useInView({
    rootMargin: "50% 0px",
    unobserveOnEnter: true,
    onEnter() {
      setLoaded(true);
    },
  });

  return (
    <m.div
      whileTap={{
        scale: tapAnimationDuration,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
      ref={observe}
    >
      <Style>
        <Link href={`/species/${props.species.id}`} className="container">
          <m.div className="img-wrapper" layoutId={`img-${props.species.id}`}>
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
            {/* {(inView || loaded) && ( */}
              <Image
                unoptimized={
                  process.env.NEXT_PUBLIC_SKIP_IMAGE_OPTIMIZATION === "true"
                }
                src={
                  props.species?.photos?.[0]?.original_url ??
                  "/img/no-image.svg"
                }
                priority={inView}
                fill
                style={{ objectFit: "cover" }}
                sizes="40vw"
                alt={props.species.scientific_name}
              />
            {/* )} */}
          </m.div>
          <m.div className="content" layoutId={`title-${props.species.id}`}>
            {props.species.common_names?.fr?.length > 0 && (
              <div className="title">
                <div>
                  <FrFlagSvg width="12px" />
                </div>
                <span className="ml-1">
                  {capitalizeWords(props.species.common_names.fr[0])}
                </span>
              </div>
            )}
            {props.species.common_names?.en?.length > 0 && (
              <div className="title">
                <div>
                  <GbFlagSvg width="12px" />
                </div>
                <span className="ml-1">
                  {capitalizeWords(props.species.common_names.en[0])}
                </span>
              </div>
            )}
            <div className="scientific-name">
              {capitalizeFirstLetter(props.species.scientific_name)}
            </div>
          </m.div>
        </Link>
      </Style>
    </m.div>
  );
}

// Style
const Style = styled.div`
  width: 100%;
  /* aspect-ratio: 2 / 2.3; */
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
      aspect-ratio: 2/1.6;
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
