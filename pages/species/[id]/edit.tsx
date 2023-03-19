/* eslint-disable react/display-name */
import { m } from "framer-motion";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";
import { forwardRef, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../../../components/commons/Header";
import { withAuthServerSideProps } from "../../../firebase/withAuth";
import { ISpecies } from "../../../types/Species";
import { getSpecies } from "../../../utils/firestore/species.firestore";
import { capitalizeWords } from "../../../utils/helper";
import { Dialog } from "primereact/dialog";
import MyButton from "../../../components/commons/MyButton";
import ChevronRightSvg from "../../../public/icons/fontawesome/light/chevron-right.svg";
import { sizes_dict } from "../../../constants/sizes_dict";
import dynamic from "next/dynamic";
import Spinner from "../../../components/commons/Spinner";
import { useRouter } from "next/router";

const FormLoading = () => (
  <div className="flex">
    <Spinner />
  </div>
);

const DynamicCommonNameFrForm = dynamic(
  () => import("../../../components/speciesForm/CommonNameFrForm"),
  { loading: () => <FormLoading />, ssr: false }
);
const DynamicCommonNameEnForm = dynamic(
  () => import("../../../components/speciesForm/CommonNameEnForm"),
  { loading: () => <FormLoading />, ssr: false }
);
const DynamicSizesForm = dynamic(
  () => import("../../../components/speciesForm/SizesForm"),
  { loading: () => <FormLoading />, ssr: false }
);
const DynamicDepthForm = dynamic(
  () => import("../../../components/speciesForm/DepthForm"),
  { loading: () => <FormLoading />, ssr: false }
);

const Edit: NextPage<{
  species: ISpecies;
}> = () => {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const childFormRef = useRef(null);
  const router = useRouter();
  const [species, setSpecies] = useState<ISpecies>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!species || refreshKey > 0) {
      getSpecies(router.query.id.toString()).then((species) => {
        setSpecies(species);
      });
    }
  }, [refreshKey]);

  if (!species) {
    return (
      <div className="flex mt-5">
        <Spinner />
      </div>
    );
  }

  // https://github.com/vercel/next.js/issues/4957#issuecomment-413841689
  const getForwardedComponent = <P extends {}>(Component: any): any => {
    return forwardRef((props: P, ref: React.Ref<unknown>) => (
      <Component
        {...props}
        forwardedRef={ref}
        species={species}
        submitCallback={() => {
          setRefreshKey(refreshKey + 1);
          closeDialog();
        }}
      />
    ));
  };
  const ForwardedRefDynamicSizesForm = getForwardedComponent(DynamicSizesForm);
  const ForwardedRefDynamicDepthForm = getForwardedComponent(DynamicDepthForm);
  const ForwardedRefDynamicCommonNameFrForm = getForwardedComponent(
    DynamicCommonNameFrForm
  );
  const ForwardedRefDynamicCommonNameEnForm = getForwardedComponent(
    DynamicCommonNameEnForm
  );

  const handleChildFormSubmit = async () => {
    childFormRef.current.submit();
  };

  const fields: any[] = [
    {
      id: "common_names_fr",
      label: "Nom communs francophones",
      value: capitalizeWords(species.common_names.fr.join(", ")) || "-",
    },
    {
      id: "common_names_en",
      label: "Noms communs anglophones",
      value: capitalizeWords(species.common_names.en.join(", ")) || "-",
    },
    {
      id: "sizes",
      label: "Tailles (en cm)",
      value:
        Object.keys(species.sizes).length > 0 ? (
          <>
            {Object.keys(species.sizes).map((size) => (
              <div key={size}>
                {sizes_dict[size].fr} : {(species.sizes as any)[size]} cm
              </div>
            ))}
          </>
        ) : (
          <>-</>
        ),
    },
    {
      id: "depth",
      label: "Profondeur (en m)",
      value: `Entre ${species.depth_min} et ${species.depth_max} mètres`,
    },
  ];

  fields.forEach((field) => {
    field.onClick = () => {
      setSelectedField(field.id);
      setShowDialog(true);
    };
  });

  const closeDialog = () => {
    setSelectedField(null);
    setShowDialog(false);
  };

  const dialogFooter = (
    <div className="grid max-width-500">
      <div className="col-6">
        <MyButton
          outline
          className="w-full"
          onClick={() => {
            closeDialog();
          }}
        >
          Annuler
        </MyButton>
      </div>
      <div className="col-6">
        <MyButton
          primary
          className="w-full"
          type="submit"
          onClick={() => {
            handleChildFormSubmit();
          }}
        >
          Publier
        </MyButton>
      </div>
    </div>
  );

  return (
    <>
      <Style className="max-width-800">
        <Header title={"Edit"} showBackButton />
        <ListMenu className="max-width-500">
          {fields.map((field) => (
            <ItemStyle
              key={field.id}
              className="global-padding"
              onClick={field.onClick}
            >
              <div>
                <div className="label">{field.label}</div>
                <div className="value">{field.value}</div>
              </div>
              <ChevronRightSvg
                aria-label="right"
                className="svg-icon"
                style={{ width: "14px" }}
              />
            </ItemStyle>
          ))}
        </ListMenu>
      </Style>
      {/* {selectedField === "common_names_fr" && <CommonNameFrForm species={species} ref={childFormRef} />} */}
      <Dialog
        header={fields.find((field) => field.id === selectedField)?.label}
        visible={showDialog}
        style={{
          width: "100vw",
          height: "100vh",
          maxHeight: "100vh",
          margin: 0,
        }}
        footer={dialogFooter}
        onHide={() => {
          closeDialog();
        }}
      >
        <div className="max-width-500 py-3">
          {selectedField === "common_names_fr" && (
            <ForwardedRefDynamicCommonNameFrForm ref={childFormRef} />
          )}
          {selectedField === "common_names_en" && (
            <ForwardedRefDynamicCommonNameEnForm ref={childFormRef} />
          )}
          {selectedField === "sizes" && (
            <ForwardedRefDynamicSizesForm ref={childFormRef} />
          )}
          {selectedField === "depth" && (
            <ForwardedRefDynamicDepthForm ref={childFormRef} />
          )}
        </div>
      </Dialog>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = withAuthServerSideProps(
  async (context: GetServerSidePropsContext, decodedToken: any) => {
    if (!decodedToken || !decodedToken?.isAdmin) {
      console.error("Not authorized");
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  }
);

export default Edit;

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

const ListMenu = styled.div`
  list-style: none;
`;

const ItemStyle = styled(m.div)`
  border-bottom: 1px solid var(--border-color);
  padding-top: 8px;
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
  transition: all 0.2s ease;

  &:active {
    background-color: #f0f0f0;
  }

  .label {
    color: var(--text-color-2);
    font-size: 1rem;
    font-weight: 400;
  }

  .value {
    font-size: 1rem;
    font-weight: 600;
  }
`;
