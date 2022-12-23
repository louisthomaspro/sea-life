import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import { ISpecies } from "../../types/Species";
import { blurDataURL } from "../../utils/helper";

export default function SpeciesSlider(props: { species: ISpecies }) {
  const [currentSlide, setCurrentSlide] = useState(0); // keenSlider
  const [sliderRef] = useKeenSlider({
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return (
    <Style ref={sliderRef} className="keen-slider">
      <div className="img-counter">
        {currentSlide + 1} / {props.species.photos.length}
      </div>
      {props.species.photos?.map((photo, i) => (
        <div
          className="keen-slider__slide img-wrapper"
          key={props.species.id + i}
          onClick={() => {}}
        >
          <Image
            // loader={firebaseStorageLoader}
            placeholder="blur"
            blurDataURL={blurDataURL()}
            src={photo.original_url}
            alt={props.species.scientific_name}
            layout="fill"
            objectFit="cover"
            priority={i === 0}
          />
        </div>
      ))}
    </Style>
  );
}

// Style
const Style = styled.div`
  position: relative;
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  overflow: hidden;

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
`;
