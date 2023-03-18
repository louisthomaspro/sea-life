import { Skeleton } from "primereact/skeleton";

export default function CustomSearchBoxSkeleton() {
  return (
    <div
      className="flex align-items-center justify-content-center"
      style={{
        height: "45.5px",
        borderRadius: "100px",
        backgroundColor: "white",
      }}
    >
      <Skeleton width="60%" height="10px"></Skeleton>
    </div>
  );
}
