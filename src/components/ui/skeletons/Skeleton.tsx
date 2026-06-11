type Props = {
  className?: string;
};

export function Skeleton({ className = "" }: Props) {
  return <div className={`bg-gray-200 animate-pulse rounded ${className}`} />;
}

export function SkeletonText({ className = "" }: Props) {
  return <Skeleton className={`h-4 ${className}`} />;
}

export function SkeletonCircle({ className = "" }: Props) {
  return <Skeleton className={`rounded-full ${className}`} />;
}
