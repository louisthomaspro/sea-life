import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import { IGroup } from "../../types/Group";
import { useRouter } from "next/router";
import { BlurhashCanvas } from "react-blurhash";
import { useInView } from "react-cool-inview";
import { useState } from "react";

export default function GroupCardGrid(props: {
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
        <Link href={`/explore/${region}/${groupsJoin}/${props.group.id}`}>
          <div className="grid grid-nogutter relative">
            {[0, 1, 2, 3].map((i) => (
              <div className="col-6 box" key={i}>
                <div className="img-container relative">
                  {props.group.photos?.[i]?.blurhash && (
                    <BlurhashCanvas
                      {...props.group.photos[i].blurhash}
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
                        props.group.photos?.[i]?.original_url ??
                        "/img/no-image.svg"
                      }
                      priority={inView}
                      fill
                      sizes="20vw"
                      style={{ objectFit: "cover" }}
                      alt={props.group.title.fr ?? "No title"}
                    />
                  {/* )} */}
                </div>
              </div>
            ))}
            <div className="badge">
              {props.group.species_count[region as string]}
            </div>
          </div>
          <div className="content">
            <div className="title">{props.group.title.fr}</div>
            {props.group.subtitle && (
              <div className="subtitle">
                {props.group.subtitle.fr ?? "No subtitle"}
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

  .box {
    padding: 1px;

    .img-container {
      border-radius: 8px;
      /* border: 1px solid black; */
      width: 100%;
      position: relative;
      aspect-ratio: 2/1.6;
      overflow: hidden;
    }
  }

  .content {
    padding: 4px 12px 6px 12px;
    text-align: center;
    min-height: 48px;
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
      font-style: italic;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;
