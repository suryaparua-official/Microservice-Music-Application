import { CardSkeleton } from "./Skeleton";

const Loading = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex flex-col px-6 pt-8">
    <div className="mb-8">
      <div className="skeleton h-6 w-40 rounded-lg mb-5" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="min-w-[160px]">
            <CardSkeleton />
          </div>
        ))}
      </div>
    </div>
    <div>
      <div className="skeleton h-6 w-52 rounded-lg mb-5" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="min-w-[160px]">
            <CardSkeleton />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Loading;
