import { Skeleton } from "primereact/skeleton";

export default function RegionDropdownSkeleton() {
  return (
    <div
      className="flex align-items-center justify-content-center"
      style={{ height: "42px", backgroundColor: "#ebf1f7" }}
    >
      <Skeleton width="180px" height="10px"></Skeleton>
    </div>
  );
}
