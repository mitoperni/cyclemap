function SkeletonRow() {
  return (
    <div className="grid grid-cols-[1fr_80px_80px] gap-4 border-b border-gray-100 px-[40px] pt-[40px]">
      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="mx-auto h-5 w-8 animate-pulse rounded bg-gray-200" />
      <div className="mx-auto h-5 w-8 animate-pulse rounded bg-gray-200" />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex flex-col gap-6 pb-6 border-b border-gray-100">
      {/* Back button skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Network info skeleton */}
      <div className="flex flex-col gap-3">
        {/* Title */}
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />

        {/* Location */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Companies */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Stats */}
        <div className="mt-2">
          <div className="h-12 w-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

interface StationsTableSkeletonProps {
  rows?: number;
}

export function StationsTableSkeleton({ rows = 8 }: StationsTableSkeletonProps) {
  return (
    <div className="flex flex-col">
      <HeaderSkeleton />

      {/* Table header */}
      <div className="mt-6 grid grid-cols-[1fr_80px_80px] gap-4 border-b border-gray-200 pb-3 text-sm font-medium text-torea-bay-600">
        <span>Station name</span>
        <span className="text-center">Free bikes</span>
        <span className="text-center">Empty slots</span>
      </div>

      {/* Skeleton rows */}
      <div className="flex flex-col">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  );
}
