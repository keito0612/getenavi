export function MapSkeleton() {
  return (
    <div className="w-full h-full bg-gray-100 relative overflow-hidden">
      {/* 道路風のライン */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 right-0 h-3 bg-gray-200 animate-pulse" />
        <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-200 animate-pulse" />
        <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-200 animate-pulse" />
        <div className="absolute left-1/4 top-0 bottom-0 w-3 bg-gray-200 animate-pulse" />
        <div className="absolute left-1/2 top-0 bottom-0 w-4 bg-gray-200 animate-pulse" />
        <div className="absolute left-3/4 top-0 bottom-0 w-2 bg-gray-200 animate-pulse" />
      </div>
      {/* マーカー風のドット */}
      <div className="absolute top-1/3 left-1/4 w-4 h-4 rounded-full bg-orange-200 animate-pulse" />
      <div className="absolute top-1/2 left-2/3 w-4 h-4 rounded-full bg-orange-200 animate-pulse" />
      <div className="absolute top-2/3 left-1/3 w-4 h-4 rounded-full bg-orange-200 animate-pulse" />
    </div>
  );
}
