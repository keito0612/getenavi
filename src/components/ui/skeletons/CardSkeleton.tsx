import { CardContainer, FlexRow } from "../containers";
import { Skeleton, SkeletonText } from "./Skeleton";

type Props = {
  showRemoveButton?: boolean;
};

export function CardSkeleton({ showRemoveButton = false }: Props) {
  return (
    <CardContainer>
      <div className="flex">
        <Skeleton className="w-28 h-28 shrink-0 rounded-none" />
        <div className="flex-1 p-3 space-y-2">
          <SkeletonText className="w-3/4 h-5" />
          <SkeletonText className="w-16" />
          <FlexRow gap="sm">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-5 w-14" />
          </FlexRow>
        </div>
      </div>
      {showRemoveButton && (
        <div className="px-3 pb-3">
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
      )}
    </CardContainer>
  );
}
