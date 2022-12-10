import { ProgressSpinner } from "primereact/progressspinner";

export default function Spinner() {
  return (
    <ProgressSpinner
      style={{ width: "30px", height: "30px" }}
      strokeWidth="6"
      animationDuration=".5s"
    />
  );
}
