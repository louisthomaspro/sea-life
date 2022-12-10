import Image from "next/image";
import Link from "next/link";
import { ILife } from "../../types/Life";
import { blurDataURL, firebaseStorageLoader } from "../../utils/helper";
import FrFlagSvg from "../../public/icons/flags/FR.svg";
import GbFlagSvg from "../../public/icons/flags/GB.svg";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";

export default function SpeciesCard(props: { life: ILife }) {
  return (
    <m.div
      whileTap={{
        scale: tapAnimationDuration,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      <Style>
        <Link href={`/life/${props.life.id}`}>
          <a
          // onClick={() => {
          //   setPageAnimation({ animation: "right", date: new Date() });
          // }}
          >
            <div className="img-wrapper">
              {props.life?.photos?.[0]?.storage_path && (
                <Image
                  loader={firebaseStorageLoader}
                  src={props.life?.photos?.[0]?.storage_path}
                  layout="fill"
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  objectFit="cover"
                  sizes="50vw"
                  alt={
                    props.life.french_common_name ?? props.life.scientific_name
                  }
                />
              )}
            </div>
            <div className="content">
              {props.life.french_common_name && (
                <div className="title">
                  <div>
                    <FrFlagSvg width="12px" />
                  </div>
                  <span className="ml-1">{props.life.french_common_name}</span>
                </div>
              )}
              {props.life.english_common_name && (
                <div className="title">
                  <div>
                    <GbFlagSvg width="12px" />
                  </div>
                  <span className="ml-1">{props.life.english_common_name}</span>
                </div>
              )}
              <div className="scientific-name">
                {props.life.scientific_name}
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
