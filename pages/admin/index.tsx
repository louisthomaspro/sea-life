import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useRef, useState } from "react";
import LifeTree from "../../components/admin/LifeTree";
import dynamic from "next/dynamic";
import Header from "../../components/commons/Header";
const LifeFormDynamic = dynamic(
  () => import("../../components/admin/LifeCreateForm")
);

const Admin = () => {
  const [displayCreateFrom, setDisplayCreateForm] = useState(false);

  const lifeTreeRef = useRef(null);

  return (
    <>
      <Header title="Admin" showBackButton showHomeButton />
      <div className="main-container">
        <Button
          className="mb-3"
          label="Ajouter une espèce"
          onClick={() => setDisplayCreateForm(true)}
        />
      </div>
      <LifeTree ref={lifeTreeRef} />

      <Dialog
        className="dialogModal"
        header="Ajouter une espèce"
        visible={displayCreateFrom}
        onHide={() => setDisplayCreateForm(false)}
        style={{ width: "75vw" }}
      >
        <LifeFormDynamic
          onSubmit={() => {
            setDisplayCreateForm(false);
            lifeTreeRef.current.reload();
          }}
        />
      </Dialog>
    </>
  );
};

export default Admin;
