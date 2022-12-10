import { useRouter } from "next/router";

import React from "react";
import Header from "../../../components/commons/Header";
import LifeUpdateForm from "../../../components/admin/LifeUpdateForm";

const Update = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Header title={`Update`} showBackButton shadow />

      <div className="main-container">  
        <LifeUpdateForm
          id={id as string}
          onSubmit={() => {
            router.back();
          }}
        />
      </div>
    </>
  );
};

export default Update;
