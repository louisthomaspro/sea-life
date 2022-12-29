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
  species: ISpecies;
}> = ({ species }) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Style>
      <Header title={species?.common_name?.fr[0]} showBackButton shadow fixed />

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
          {species?.photos?.map((photo) => (
            <a
              id={photo.id}
              key={photo.id}
              data-fancybox="gallery"
              href={photo.original_url}
            >
              <div className="img-wrapper">
                <Image
                  src={photo.original_url}
                  fill
                  placeholder="blur"
                  blurDataURL={blurDataURL()}
                  alt={species?.common_name?.fr[0]}
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
