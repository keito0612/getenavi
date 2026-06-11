import { FlexRow } from "../containers";
import { Skeleton, SkeletonCircle } from "./Skeleton";

export function HeaderSkeleton() {
  return (
    <header className="bg-orange-500 text-white px-4 py-3 shadow-md">
      <FlexRow align="between">
        <Skeleton className="h-7 w-24 bg-white/20" />
        <FlexRow gap="md">
          <SkeletonCircle className="h-9 w-9 bg-white/20" />
          <SkeletonCircle className="h-9 w-9 bg-white/20" />
        </FlexRow>
      </FlexRow>
    </header>
  );
}
