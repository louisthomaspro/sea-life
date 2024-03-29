import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import { useRouter } from "next/router";
import { IGroup } from "../../types/Group";
import ChevronRightSvg from "../../public/icons/fontawesome/light/chevron-right.svg";
import { BlurhashCanvas } from "react-blurhash";
import { useState } from "react";
import { useInView } from "react-cool-inview";

export default function GroupListItem(props: {
  group: IGroup;
  index?: number;
}) {
  const router = useRouter();
  const { region, groups } = router.query;

  const [loaded, setLoaded] = useState(false);
  const { observe, inView } = useInView({
    rootMargin: "50% 0px",
    unobserveOnEnter: true,
    onEnter() {
      setLoaded(true);
    },
  });

  // http://localhost:3000/explore/mediterranean-sea/fauna/mollusk
  const groupsJoin = ((groups as string[]) ?? []).join("/"); // fauna/mollusk

  return (
    <m.div
      whileTap={{
        scale: tapAnimationDuration,
        transition: { duration: 0.1, ease: "easeInOut" },
      }}
      ref={observe}
    >
      <Style>
        <Link href={`/explore/${region}/${groupsJoin}/${props.group.id}`} className="sm:flex-column">
          <div className="img-container sm:w-full">
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
              {/* {(inView || loaded) && ( */}
              <Image
                src={
                  props.group.photos?.[0]?.original_url ?? "/img/no-image.svg"
                }
                priority={inView}
                fill
                sizes="25vw"
                style={{ objectFit: "cover" }}
                alt={props.group.title.fr ?? "No title"}
              />
              {/* )} */}
            </div>
            <div className="badge hidden sm:block">
              {props.group.species_count[region as string]}
            </div>
          </div>
          <div className="content sm:text-center">
            <div className="title">{props.group.title.fr ?? "No title"}</div>
            {props.group.subtitle && (
              <div className="subtitle sm:justify-content-center">
                (
                <span className="ellipsis">
                  {props.group.subtitle.fr ?? "No subtitle"}
                </span>
                )
              </div>
            )}
            <div className="badge-text sm:hidden">
              {props.group.species_count[region as string]} espèces
            </div>
          </div>
          <div className="chevron sm:hidden">
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

  .badge-text {
    background: var(--blue);
    color: white;
    border-radius: 10px;
    padding: 2px 5px;
    font-size: 12px;
    margin-right: auto;
    margin-top: 6px;
  }

  .badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    background: var(--blue);
    color: white;
    border-radius: 10px;
    padding: 2px 5px;
    font-size: 12px;
  }

  .img-container {
    width: 25%;
    position: relative;
    aspect-ratio: 1;
    margin-bottom: auto;
    flex: none;

    .img-wrapper {
      border-radius: var(--border-radius);
      overflow: hidden;
      width: 100%;
      height: 100%;
      position: inherit;
    }
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
