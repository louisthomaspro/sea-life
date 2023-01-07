import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import Header from "../../../components/commons/Header";

import React from "react";

import Fancybox from "../../../components/commons/Fancybox";
import { ISpecies } from "../../../types/Species";
import { getSpecies } from "../../../utils/firestore/species.firestore";
import { BlurhashCanvas } from "react-blurhash";
import { getPlaiceholder } from "plaiceholder";
import { defaultBlurhashOptions } from "../../../constants/config";
import { capitalizeWords } from "../../../utils/helper";

const Gallery: NextPage<{
  species: ISpecies;
}> = ({ species }) => {
  const router = useRouter();

  return (
    <Style>
      <Header
        title={capitalizeWords(species?.common_names?.fr[0])}
        showBackButton
        shadow
        fixed
      />

      <div className="main-container">
        <Fancybox
          options={{
            Toolbar: {
              display: ["close", "counter"],
            },
            Thumbs: {
              autoStart: false,
            },
            Image: {
              zoom: false,
              click: null,
              doubleClick: "toggleZoom",
            },
            Hash: false,
          }}
        >
          {species?.photos?.map((photo, index) => (
            <a
              id={String(index)}
              key={String(index)}
              data-fancybox="gallery"
              href={photo.original_url}
            >
              <div className="img-wrapper">
                {photo.blurhash && (
                  <BlurhashCanvas
                    {...photo.blurhash}
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
                  src={photo.original_url}
                  fill
                  style={{ objectFit: "cover" }}
                  alt={species?.common_names?.fr[0]}
                  priority={index < 3}
                />
              </div>
            </a>
          ))}
        </Fancybox>
      </div>
    </Style>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  const species: ISpecies = JSON.parse(
    JSON.stringify(await getSpecies(id.toString()))
  );

  // Generate bluhash for each image
  if (process.env.NEXT_PUBLIC_SKIP_BLURHASH !== "true") {
    await Promise.all(
      species.photos.map(async (photo) => {
        const { blurhash, img } = await getPlaiceholder(photo.original_url, {
          ...defaultBlurhashOptions,
        });
        photo.blurhash = blurhash;
      })
    );
  }

  if (species) {
    return { props: { species } };
  } else {
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  // get all life ids...
  return {
    paths: [],
    fallback: true,
  };
};

export default Gallery;

// Style
const Style = styled.div`
  .img-wrapper {
    width: 100%;
    position: relative;
    padding-bottom: 70%;
    overflow: hidden;
    margin-bottom: 10px;
  }
`;
