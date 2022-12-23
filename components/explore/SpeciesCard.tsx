import Image from "next/image";
import Link from "next/link";
import { ILife } from "../../types/Life";
import { blurDataURL, firebaseStorageLoader } from "../../utils/helper";
import FrFlagSvg from "../../public/icons/flags/FR.svg";
import GbFlagSvg from "../../public/icons/flags/GB.svg";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import { ISpecies } from "../../types/Species";

export default function SpeciesCard(props: { species: ISpecies }) {
  return (
    <m.div
      whileTap={{
        scale: tapAnimationDuration,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      <Style>
        <Link href={`/species/${props.species.id}`}>
          <a>
            <div className="img-wrapper">
              {props.species?.photos?.[0]?.original_url && (
                <Image
                  src={props.species?.photos?.[0]?.original_url}
                  layout="fill"
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  objectFit="cover"
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
          </a>
        </Link>
      </Style>
    </m.div>
  );
}

// Style
const Style = styled.button`
  width: 100%;
  background-color: var(--bg-grey);
  border-radius: var(--border-radius);
  padding: 6px;

  a {
    text-decoration: none;
    color: var(--text-color-1);
  }

  .img-wrapper {
    width: 100%;
    position: relative;
    padding-bottom: 60%;
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
    }
  }
`;
