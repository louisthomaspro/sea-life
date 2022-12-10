import Image from "next/image";
import Link from "next/link";
import { ILife } from "../../types/Life";
import { blurDataURL, firebaseStorageLoader } from "../../utils/helper";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";

export default function GroupCard(props: { life: ILife }) {
  return (
    <m.div
      whileTap={{
        scale: tapAnimationDuration,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      <Style>
        <Link href={`/life/${props.life.id}`}>
          <a>
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
                  priority
                  alt={
                    props.life.french_common_name ?? props.life.scientific_name
                  }
                />
              )}
            </div>
            <div className="content">
              <div className="title">
                {props.life.french_common_name ?? props.life.scientific_name}
              </div>
              {props.life.group_short_description && (
                <div className="subtitle">
                  (
                  <span className="ellipsis">
                    {props.life.group_short_description}
                  </span>
                  )
                </div>
              )}
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

  a {
    text-decoration: none;
    color: var(--text-color-1);
  }

  .img-wrapper {
    width: 100%;
    position: relative;
    padding-bottom: 70%;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    overflow: hidden;
  }

  .content {
    padding: 4px 12px 6px 12px;
    text-align: center;
    min-height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .title {
      font-size: 16px;
      font-weight: bold;
      width: 100%;
    }

    .subtitle {
      font-size: 12px;
      display: flex;
      width: 100%;
      justify-content: center;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;
