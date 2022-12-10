import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ILife } from "../../types/Life";
import {
  getChildren,
  getGroups,
  getLife,
} from "../../utils/firestore/life.firestore";
import styled from "styled-components";
import Header from "../../components/commons/Header";
import dynamic from "next/dynamic";
import SpeciesInformation from "../../components/species/SpeciesInformation";
import GroupCard from "../../components/explore/GroupCard";
import Section from "../../components/commons/Section";
import { useInView } from "react-cool-inview";
import { useContext, useState } from "react";
import Link from "next/link";
import PencilSvg from "../../public/icons/primeicons/pencil.svg";
import RoundButton from "../../components/commons/RoundButton";
import AuthContext from "../../context/auth.context";

const DynamicSpeciesListFromAncestorId = dynamic(
  () => import("../../components/explore/SpeciesListFromAncestorId")
);

const Life: NextPage<{
  life: ILife;
  groups: ILife[];
}> = ({ life, groups }) => {
  const router = useRouter();
  const [displayFixedHeader, setDisplayFixedHeader] = useState(false);

  const { userData } = useContext(AuthContext);

  const { observe, unobserve, inView, scrollDirection, entry } = useInView({
    onEnter: ({ scrollDirection, entry, observe, unobserve }) => {
      setDisplayFixedHeader(false);
    },
    onLeave: ({ scrollDirection, entry, observe, unobserve }) => {
      setDisplayFixedHeader(true);
    },
    // More useful options...
  });

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <Style>
      {life.type === "species" ? (
        <>
          <div className="absolute z-1 w-full">
            <Header showHomeButton showBackButton noBackground />
          </div>
          <SpeciesInformation life={life} />
        </>
      ) : (
        <>
          <div
            ref={observe}
            style={{ height: "100px", top: 0 }}
            className="absolute"
          ></div>
          {displayFixedHeader && (
            <div className="fixedHeader">
              <Header
                title={life.french_common_name}
                showHomeButton
                showBackButton
                shadow
              />
            </div>
          )}
          <Header
            title={life.french_common_name}
            showHomeButton
            showBackButton
            shadow
          />
          <div className="main-container">
            {userData?.isAdmin && !["fauna", "flora"].includes(life.id) && (
              <Link href={`/life/${life.id}/update`}>
                <div>
                  <RoundButton ariaLabel="edit">
                    <PencilSvg
                      className="svg-icon flex"
                      style={{ width: "28px" }}
                    />
                  </RoundButton>
                </div>
              </Link>
            )}
            {groups.length > 0 && (
              <Section title={`GROUPES (${groups.length})`}>
                <div
                  className="grid mb-3 grid-nogutter"
                  style={{ marginRight: "-0.25rem", marginLeft: "-0.25rem" }}
                >
                  {groups?.map((life: any) => (
                    <div className="col-6 p-1 mb-2" key={life.id}>
                      <GroupCard life={life} />
                    </div>
                  ))}
                </div>
              </Section>
            )}

            <Section title="ESPÈCES">
              <DynamicSpeciesListFromAncestorId ancestorId={life.id} />
            </Section>
          </div>
        </>
      )}
    </Style>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;

  const life: ILife = JSON.parse(JSON.stringify(await getLife(id.toString())));

  let groups: ILife[] = [];
  groups = JSON.parse(JSON.stringify(await getChildren(life.id, "group")));

  if (life) {
    return { props: { life, groups }, revalidate: 120 };
  } else {
    return { notFound: true };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const groups = await getGroups();
  const paths = groups.map((group) => ({
    params: { id: group.id },
  }));

  return {
    paths: process.env.SKIP_BUILD_STATIC_GENERATION ? [] : paths,
    fallback: true,
  };
};

export default Life;

// Style
const Style = styled.div`
  width: 100%;

  .fixedHeader {
    position: fixed;
    z-index: 1;
    width: 100%;
  }
`;
