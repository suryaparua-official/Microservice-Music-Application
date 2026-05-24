interface SkeletonProps {
  className?: string;
  circle?: boolean;
}

const Skeleton = ({ className = "", circle = false }: SkeletonProps) => (
  <div
    className={`skeleton ${circle ? "rounded-full" : "rounded-lg"} ${className}`}
  />
);

export const CardSkeleton = () => (
  <div className="flex flex-col gap-3 min-w-[160px]">
    <Skeleton className="w-full aspect-square" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

export const RowSkeleton = () => (
  <div className="flex items-center gap-4 py-3 px-2">
    <Skeleton className="w-6 h-4" />
    <Skeleton className="w-10 h-10 shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-3 w-1/4" />
    </div>
    <Skeleton className="h-3 w-10 hidden sm:block" />
  </div>
);

export const AlbumHeaderSkeleton = () => (
  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-end p-6 sm:p-8">
    <Skeleton className="w-40 h-40 sm:w-52 sm:h-52 shrink-0" />
    <div className="flex flex-col gap-3 flex-1 w-full">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);

export default Skeleton;
