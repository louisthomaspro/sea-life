import Image from "next/image";
import styled from "styled-components";
import { ISpecies } from "../../types/Species";
import { tapAnimationDuration } from "../../constants/config";
import Link from "next/link";
import BlurhashImage from "../commons/BlurhashImage";
import { m } from "framer-motion";

export default function ExploreCard(props: {
  title: string;
  subtitle: string;
  image: string;
  blurhash: any;
}) {
  return (
    <CategoryBox
      whileTap={{
        scale: tapAnimationDuration,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      <div className="content">
        <div className="title">{props.title}</div>
        <div className="subtitle">{props.subtitle}</div>
      </div>
      <div className="img-wrapper">
        <BlurhashImage blurhash={props.blurhash} />
        <Image
          src={props.image}
          fill
          style={{ objectFit: "cover" }}
          sizes="50vw"
          className="relative"
          priority
          alt="Sea Turtle"
        />
      </div>
    </CategoryBox>
  );
}

const CategoryBox = styled(m.div)`
  border-radius: var(--border-radius);
  width: 100%;
  display: flex;
  aspect-ratio: 1;
  overflow: hidden;
  position: relative;
  width: 100%;

  > .img-wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;

    img {
      object-fit: contain;
      height: 100%;
      z-index: 1;
      position: relative;
    }
  }

  > .content {
    position: relative;
    z-index: 2;
    padding: 20px;
    min-width: 150px;
    color: white;

    .title {
      font-size: 1.8rem;
      font-weight: 600;
      letter-spacing: 0.015em;
    }
  }
`;
