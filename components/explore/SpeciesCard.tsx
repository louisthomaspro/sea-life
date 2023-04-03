import Image from "next/image";
import { capitalizeFirstLetter, capitalizeWords } from "../../utils/helper";
import FrFlagSvg from "../../public/icons/flags/FR.svg";
import GbFlagSvg from "../../public/icons/flags/GB.svg";
import styled from "styled-components";
import { ISpecies } from "../../types/Species";
import { BlurhashCanvas } from "react-blurhash";
import { Skeleton } from "primereact/skeleton";

export default function SpeciesCard(props: { species: ISpecies }) {
  return (
    <Style>
      <div className="img-wrapper">
        {props.species?.photos?.[0] && (
          <>
            {props.species?.photos?.[0]?.blurhash ? (
              <BlurhashCanvas
                {...props.species.photos[0].blurhash}
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
            ) : (
              <Skeleton className="h-full z-0" />
            )}
          </>
        )}
        <Image
          unoptimized={
            process.env.NEXT_PUBLIC_SKIP_IMAGE_OPTIMIZATION === "true"
          }
          src={props.species?.photos?.[0]?.original_url ?? "/img/no-image.svg"}
          fill
          style={{ objectFit: "cover" }}
          sizes="40vw"
          alt={props.species.scientific_name}
        />
      </div>
      <div className="content">
        {props.species.common_names?.fr?.length > 0 && (
          <div className="title">
            <div>
              <FrFlagSvg width="12px" />
            </div>
            <span className="ml-1">
              {capitalizeWords(props.species.common_names.fr[0])}
            </span>
          </div>
        )}
        {props.species.common_names?.en?.length > 0 && (
          <div className="title">
            <div>
              <GbFlagSvg width="12px" />
            </div>
            <span className="ml-1">
              {capitalizeWords(props.species.common_names.en[0])}
            </span>
          </div>
        )}
        <div className="scientific-name">
          {capitalizeFirstLetter(props.species.scientific_name)}
        </div>
      </div>
    </Style>
  );
}

// Style
const Style = styled.div`
  background-color: var(--bg-grey);
  border-radius: var(--border-radius);
  padding: 6px;
  display: flex;
  flex-direction: column;

  .img-wrapper {
    position: relative;
    aspect-ratio: 2/1.6;
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

      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
