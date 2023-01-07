import Image from "next/image";
import Link from "next/link";
import { blurDataURL, firebaseStorageLoader } from "../../utils/helper";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import { useRouter } from "next/router";
import { IGroup } from "../../types/Group";
import ArrowRightSvg from "../../public/icons/fontawesome/light/arrow-right.svg";
import ChevronRightSvg from "../../public/icons/fontawesome/light/chevron-right.svg";
import { BlurhashCanvas } from "react-blurhash";

export default function GroupListItem(props: {
  group: IGroup;
  index?: number;
}) {
  const router = useRouter();
  const { region, groups } = router.query;

  // http://localhost:3000/explore/mediterranean-sea/fauna/mollusk
  const groupsJoin = ((groups as string[]) ?? []).join("/"); // fauna/mollusk

  return (
    <m.div
      whileTap={{
        scale: tapAnimationDuration,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
    >
      <Style>
        <Link href={`/explore/${region}/${groupsJoin}/${props.group.id}`}>
          <div className="img-wrapper">
            {props.group?.photos?.[0]?.blurhash && (
              <BlurhashCanvas
                {...props.group.photos[0].blurhash}
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
              src={props.group.photos?.[0]?.original_url ?? "/img/no-image.svg"}
              fill
              sizes="25vw"
              style={{ objectFit: "cover" }}
              alt={props.group.title.fr ?? "No title"}
              // priority={props.index < 5}
            />
          </div>
          <div className="content">
            <div className="title">{props.group.title.fr ?? "No title"}</div>
            {props.group.subtitle && (
              <div className="subtitle">
                (
                <span className="ellipsis">
                  {props.group.subtitle.fr ?? "No subtitle"}
                </span>
                )
              </div>
            )}
            <div className="badge">
              {props.group.species_count[region as string]} espèces
            </div>
          </div>
          <div className="chevron">
            <ChevronRightSvg
              aria-label="right"
              className="svg-icon"
              style={{ width: "14px" }}
            />
          </div>
        </Link>
      </Style>
    </m.div>
  );
}

// Style
const Style = styled.button`
  width: 100%;
  /* background-color: var(--bg-grey); */

  a {
    display: flex;
  }

  .badge {
    background: var(--blue);
    color: white;
    border-radius: 10px;
    padding: 2px 5px;
    font-size: 12px;
    margin-right: auto;
    margin-top: 6px;
  }

  .img-wrapper {
    width: 25%;
    position: relative;
    aspect-ratio: 1/1;
    border-radius: var(--border-radius);
    overflow: hidden;
    flex: none;
  }

  .content {
    flex-grow: 1;
    padding: 4px 12px 6px 12px;
    display: flex;
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

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .chevron {
    display: flex;
    padding: 0 6px;
  }
`;
