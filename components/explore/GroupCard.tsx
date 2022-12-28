import Image from "next/image";
import Link from "next/link";
import { blurDataURL, firebaseStorageLoader } from "../../utils/helper";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import { useRouter } from "next/router";
import { IGroup } from "../../types/Group";

export default function GroupCard(props: { group: IGroup }) {
  const router = useRouter();

  // http://localhost:3000/explore/mediterranean-sea/fauna
  const slug = (router.query.slug as string[]) || []; // ["mediterranean-sea", "fauna"]
  const slugUrl = slug.length > 0 ? "/" + slug.join("/") : ""; // "/mediterranean-sea/fauna"

  return (
    <m.div
      whileTap={{
        scale: tapAnimationDuration,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      <Style>
        <Link href={`/explore${slugUrl}/${props.group.permalink}`}>
          <div className="img-wrapper">
            {/* {props.group?.photos?.[0]?.storage_path && (
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
              )} */}
          </div>
          <div className="content">
            <div className="title">{props.group.title.fr ?? "No title"}</div>
            {Object.keys(props.group.subtitle ?? {}).length > 0 && (
              <div className="subtitle">
                (
                <span className="ellipsis">
                  {props.group.subtitle.fr ?? "No subtitle"}
                </span>
                )
              </div>
            )}
          </div>
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
