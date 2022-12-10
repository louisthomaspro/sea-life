import Image from "next/image";
import { ILife, ITaxaRank } from "../../types/Life";
import cloneDeep from "lodash/cloneDeep";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useContext, useState } from "react";
import styled from "styled-components";
import FrFlagSvg from "../../public/icons/flags/FR.svg";
import GbFlagSvg from "../../public/icons/flags/GB.svg";
import PencilSvg from "../../public/icons/primeicons/pencil.svg";
import ShareSvg from "../../public/icons/primeicons/share-alt.svg";
import FavoriteButton from "./FavoriteButton";
import Section from "../commons/Section";
import { blurDataURL, firebaseStorageLoader } from "../../utils/helper";
import Link from "next/link";
import RoundButton from "../commons/RoundButton";
import AuthContext from "../../context/auth.context";
import Life from "../../pages/life/[id]";

export default function SpeciesInformation(props: { life: ILife }) {
  const [currentSlide, setCurrentSlide] = useState(0); // keenSlider
  const { userData } = useContext(AuthContext);

  const [sliderRef] = useKeenSlider({
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const taxonomyTemplate = (taxonomy: ITaxaRank[]) => {
    if (taxonomy.length === 0) {
      return "";
    }
    const life = taxonomy[0];
    taxonomy.shift();
    return (
      <ul>
        <li>
          {life.french_common_name ? (
            life.french_common_name
          ) : (
            <span className="font-italic">{life.scientific_name}</span>
          )}
        </li>
        {taxonomyTemplate(taxonomy)}
      </ul>
    );
  };

  return (
    <>
      <Style>
        <Link href={`/life/${props.life.id}/gallery`}>
          <div ref={sliderRef} className="keen-slider">
            <div className="img-counter">
              {currentSlide + 1} / {props.life.photos.length}
            </div>
            {props.life.photos?.map((photo, i) => (
              <div
                className="keen-slider__slide img-wrapper"
                key={photo.id}
                onClick={() => {}}
              >
                <Image
                  // loader={firebaseStorageLoader}
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  src={photo.original_url}
                  alt={props.life.scientific_name}
                  layout="fill"
                  objectFit="cover"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </Link>
        <div className="main-container">
          <div className="title-container">
            {props.life.french_common_name && (
              <div className="title">
                <div>
                  <FrFlagSvg width="16px" />
                </div>
                <span className="ml-2">{props.life.french_common_name}</span>
              </div>
            )}
            {props.life.english_common_name && (
              <div className="title">
                <div>
                  <GbFlagSvg width="16px" />
                </div>
                <span className="ml-2">{props.life.english_common_name}</span>
              </div>
            )}
            <div className="scientific-name">{props.life.scientific_name}</div>
          </div>

          <div className="flex align-items-center">
            <div className="flex-grow-1">
              <a
                href={props.life.wikipedia_url}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Wikipedia
              </a>
            </div>
            <FavoriteButton lifeId={props.life.id} />

            <RoundButton
              ariaLabel="Share"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    url: location.href,
                    title: document.title,
                  });
                } else {
                  // Show custom share UI
                }
              }}
            >
              <ShareSvg className="svg-icon flex" style={{ width: "28px" }} />
            </RoundButton>

            {userData?.isAdmin && (
              <Link href={`/life/${props.life.id}/update`}>
                <div>
                  <RoundButton ariaLabel="edit">
                    <PencilSvg
                      className="svg-icon flex"
                      style={{ width: "28px" }}
                    />
                  </RoundButton>
                </div>
              </Link>
            )}
          </div>

          <Section title="DESCRIPTION">
            <div>
              Conservation status: {props.life.conservation_status ?? "N/A"}
            </div>
            <div>Body shape: {props.life.body_shape ?? "N/A"}</div>
            <div>Habitat: {props.life.habitat ?? "N/A"}</div>
            <div>Longevity: {props.life.longevity ?? "N/A"}</div>
            <div>Common depth min: {props.life.common_depth_min ?? "N/A"}</div>
            <div>Common depth max: {props.life.common_depth_max ?? "N/A"}</div>
            <div>
              Common length: {props.life.common_length ?? "N/A"}{" "}
              {props.life.common_length_type ?? "N/A"}
            </div>
            <div>
              Max length: {props.life.max_length ?? "N/A"}{" "}
              {props.life.max_length_type ?? "N/A"}
            </div>
            <div>Diameter: {props.life.diameter ?? "N/A"}</div>
            <div>Dangerous: {props.life.dangerous ?? "N/A"}</div>
          </Section>

          <Section title="TAXONOMIE">
            <div className="taxonomy">
              {taxonomyTemplate(cloneDeep(props.life.taxonomy))}
            </div>
          </Section>
        </div>
      </Style>
    </>
  );
}

// Style
const Style = styled.div`
  padding-bottom: 20px;

  .keen-slider {
    border-radius: 0 0 var(--border-radius) var(--border-radius);
  }

  .img-wrapper {
    width: 100%;
    position: relative;
    padding-bottom: 70%;
    overflow: hidden;
  }

  .img-counter {
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 10px;
    right: var(--global-padding);
    z-index: 1;
    padding: 4px 10px;
    background: rgb(0 0 0 / 60%);
    color: #ffffff;
    font-size: 12px;
    border-radius: 5px;
  }

  .taxonomy {
    ul {
      list-style: none;
      margin-left: 20px;
      font-size: 16px;

      li {
        margin-top: 8px;

        &:before {
          content: "";
          color: #ee3c06;
          background: red;
          width: 8px;
          height: 8px;
          border-radius: 10px;
          display: inline-block;
          margin-left: -1em;
          margin-right: 12px;
        }
      }
    }
  }

  .title-container {
    padding: 0px 6px;
    margin-bottom: 16px;
    margin-top: 12px;

    .title {
      font-size: 20px;
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
      font-size: 16px;
      font-style: italic;
      color: var(--text-color-2);
    }
  }
`;
