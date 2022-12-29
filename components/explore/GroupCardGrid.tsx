import Image from "next/image";
import Link from "next/link";
import { blurDataURL, firebaseStorageLoader } from "../../utils/helper";
import styled from "styled-components";
import { m } from "framer-motion";
import { tapAnimationDuration } from "../../constants/config";
import { ISpecies } from "../../types/Species";
import { IGroup } from "../../types/Group";
import { useRouter } from "next/router";

export default function GroupCardGrid(props: { group: IGroup }) {
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
        <Link
          href={`/explore/${region}/${groupsJoin}/${props.group.id}`}
        >
          <div className="grid grid-nogutter relative">
            {[1, 2, 3, 4].map((i) => (
              <div className="col-6 box" key={i}>
                <div className="img-container relative">
                  <Image
                    src="/img/no-image.png"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                    alt={"no image"}
                  />
                </div>
              </div>
            ))}
            <div className="badge">{props.group.species_count[(region as string)]}</div>
          </div>
          <div className="content">
            <div className="title">{props.group.title.fr}</div>
            {props.group.subtitle && (
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

  .badge {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #5a91b2;
    color: white;
    border-radius: 10px;
    padding: 2px 5px;
    font-size: 12px;
  }

  .box {
    padding: 2px;

    .img-container {
      border-radius: 8px;
      border: 1px solid black;
      width: 100%;
      position: relative;
      padding-bottom: 70%;
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

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;
