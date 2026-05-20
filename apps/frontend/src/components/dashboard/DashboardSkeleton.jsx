import { Skeleton } from "../ui/Skeleton.jsx";

export function DashboardSkeleton() {
  return (
    <div className="grid gap-4">
      <div className="metric-grid">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28" />)}</div>
      <Skeleton className="h-80" />
    </div>
  );
}
