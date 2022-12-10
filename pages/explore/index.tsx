import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import BottomNavigation from "../../components/commons/BottomNavigation";
import Header from "../../components/commons/Header";
import { getClassification } from "../../utils/firestore/configuration";

const Explore: NextPage<{
  classification: any;
}> = ({ classification }) => {
  return (
    <>
      <Header title="Explore" />
      {classification?.regions?.map((child: any) => (
        <Link
          key={child.permalink}
          href={`/explore/${child.permalink}`}
        >
          {child.title}
        </Link>
      ))}
      <BottomNavigation />
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

export default Explore;
