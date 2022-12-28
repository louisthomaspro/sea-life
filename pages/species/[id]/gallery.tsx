import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";
import Header from "../../../components/commons/Header";
import { blurDataURL, firebaseStorageLoader } from "../../../utils/helper";

import React from "react";

import Fancybox from "../../../components/commons/Fancybox";
import { ISpecies } from "../../../types/Species";
import { getSpecies } from "../../../utils/firestore/species.firestore";

const Gallery: NextPage<{
  life: ISpecies;
}> = ({ life }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Style>
      <Header
        title={life?.common_name?.fr[0]}
        showBackButton
        shadow
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
          {life?.photos?.map((photo) => (
            <a
              id={photo.id}
              key={photo.id}
              data-fancybox="gallery"
              href={firebaseStorageLoader({
                src: photo.storage_path,
                width: 1200,
              })}
            >
              <div className="img-wrapper">
                <Image
                  loader={firebaseStorageLoader}
                  src={photo.storage_path}
                  fill
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  alt={life?.common_name?.fr[0]}
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

  const life: ISpecies = JSON.parse(JSON.stringify(await getSpecies(id.toString())));

  if (life) {
    return { props: { life } };
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
