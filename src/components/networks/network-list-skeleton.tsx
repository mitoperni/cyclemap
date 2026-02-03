function NetworkCardSkeleton() {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-4">
      <div className="flex flex-1 flex-col gap-2">
        {/* Title skeleton */}
        <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />

        {/* Location skeleton */}
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        </div>

        {/* Companies skeleton */}
        <div className="flex items-center gap-1.5">
          <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Arrow skeleton */}
      <div className="h-5 w-5 animate-pulse rounded bg-gray-200" />
    </div>
  );
}

interface NetworkListSkeletonProps {
  count?: number;
}

export function NetworkListSkeleton({ count = 6 }: NetworkListSkeletonProps) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }).map((_, index) => (
        <NetworkCardSkeleton key={index} />
      ))}
    </div>
  );
}
