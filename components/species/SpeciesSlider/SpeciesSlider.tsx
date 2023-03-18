import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import { ISpecies } from "../../../types/Species";
import { BlurhashCanvas } from "react-blurhash";
import dynamic from "next/dynamic";

const DynamicSpeciesSliderFancybox = dynamic(
  () => import("./SpeciesSliderFancybox")
);

const loadNeighborsRange = 2;

export default function SpeciesSlider(props: { species: ISpecies }) {
  const [currentSlide, setCurrentSlide] = useState(0); // keenSlider
  const [loadNeighbors, setLoadNeighbors] = useState(false); // next/image

  const [sliderRef] = useKeenSlider({
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return (
    <Style>
      <div ref={sliderRef} className="keen-slider">
        <div className="img-counter">
          {currentSlide + 1} / {props.species.photos.length}
        </div>
        <DynamicSpeciesSliderFancybox />
        {props.species.photos?.map((photo, i) => (
          <a
            id={String(i)}
            key={String(i)}
            data-fancybox="photo"
            href={photo.original_url}
          >
            <div
              className="keen-slider__slide img-wrapper"
              key={props.species.id + i}
              onClick={() => {}}
            >
              {photo.blurhash && (
                <BlurhashCanvas
                  {...photo.blurhash}
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
                unoptimized={
                  process.env.NEXT_PUBLIC_SKIP_IMAGE_OPTIMIZATION === "true"
                }
                src={photo.original_url}
                alt={props.species.scientific_name}
                fill
                style={{ objectFit: "cover" }}
                sizes="100vw"
                priority={
                  loadNeighbors
                    ? i <= currentSlide + loadNeighborsRange
                    : i === 0
                }
                onLoad={() => {
                  setLoadNeighbors(true);
                }}
              />
            </div>
          </a>
        ))}
      </div>
    </Style>
  );
}

// Style
const Style = styled.div`
  aspect-ratio: 3/2;
  width: 100%;

  .keen-slider {
    height: 100%;
    position: relative;
    border-radius: var(--border-radius);
    overflow: hidden;
  }

  .img-wrapper {
    width: 100%;
    position: relative;
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
`;
