import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BottomNavigation from "../../components/commons/BottomNavigation";
import Header from "../../components/commons/Header";
import { getClassification } from "../../utils/firestore/configuration";
import { getAllSpecies } from "../../utils/firestore/species.firestore";
import { searchTreeClassification } from "../../utils/helper";

const Explore: NextPage<{
  classification: any;
}> = ({ classification }) => {
  const router = useRouter();

  const [species, setSpecies] = useState<any[]>([]);
  const [currentClassification, setCurrentClassification] = useState<any>();

  // http://localhost:3000/explore/mediterranean-sea/fauna
  const slug = (router.query.slug as string[]) || []; // ["mediterranean-sea", "fauna"]
  const slugUrl = slug.length > 0 ? "/" + slug.join("/") : ""; // "/mediterranean-sea/fauna"
  const currentSlug = slug[slug.length - 1]; // "fauna"

  const showSpecies = slug.length > 4;

  useEffect(() => {
    if (!classification) return;

    // Region selected
    if (slug.length === 1) {
      const foundRegion = classification.regions.find(
        (region: any) => region.permalink === slug[0]
      );
      foundRegion.children = classification.groups;
      setCurrentClassification(foundRegion);
      console.log(foundRegion);
    } else {
      // Group selected
      const foundGroup = searchTreeClassification(
        {
          permalink: "...",
          children: classification.groups,
        },
        currentSlug
      );
      console.log(foundGroup);
      setCurrentClassification(foundGroup);
    }

    getAllSpecies(currentClassification?.scientific_name).then((data) => {
      setSpecies(data);
    });
  }, [classification]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <>
        <Header title={currentClassification?.title} showBackButton />
        <div>Slug: {slug.join("/")}</div>
        <div>Number of species: {species.length}</div>

        <hr />

        {showSpecies ? (
          <>
            <div>Species</div>
            {species.map((specie) => (
              <div key={specie.id}>{specie.scientific_name}</div>
            ))}
          </>
        ) : (
          <>
            {currentClassification?.children?.map((child: any) => (
              <Link
                key={child.id}
                href={`/explore${slugUrl}/${child.permalink}`}
              >
                {child.title}
              </Link>
            ))}
          </>
        )}
        <BottomNavigation />
      </>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const classification: any = JSON.parse(
    JSON.stringify(await getClassification())
  );
  if (classification) {
    return { props: { classification } };
  } else {
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default Explore;
