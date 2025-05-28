import { Skeleton } from "@/components/ui/skeleton";

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-black text-black dark:text-white min-h-screen">
      <div className="max-w-4xl w-full px-4 py-8 flex flex-col gap-6">
        {/* Profile Header */}
        <div className="flex items-center gap-8">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Skeleton className="w-40 h-6 rounded-md" />
              <Skeleton className="w-24 h-8 rounded-md" />
              <Skeleton className="w-24 h-8 rounded-md" />
            </div>
            <div className="flex gap-6">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-20 h-4" />
            </div>
            <div className="mt-2">
              <Skeleton className="w-60 h-4 mb-1" />
              <Skeleton className="w-48 h-4" />
            </div>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="flex gap-4 overflow-x-auto">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="w-16 h-3 mt-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      <div className="max-w-4xl w-full grid grid-cols-3 gap-1 px-4">
        {[...Array(6)].map((_, idx) => (
          <Skeleton key={idx} className="w-full h-40" />
        ))}
      </div>

      <Skeleton className="w-24 h-10 rounded-full mt-6" />
    </div>
  );
};

export default ProfileSkeleton;
