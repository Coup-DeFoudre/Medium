
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FullBlogSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* Left: Blog Content */}
      <div className="md:col-span-3 space-y-6">
        <Skeleton height={40} width="70%" />
        <div className="flex items-center gap-2">
          <Skeleton circle height={30} width={30} />
          <Skeleton width={120} />
          <Skeleton width={80} />
        </div>
        <Skeleton count={10} />
        <Skeleton height={300} />
        <Skeleton count={8} />
      </div>

      {/* Right: Author Detail Panel */}
      <div className="space-y-4">
        <Skeleton circle height={80} width={80} />
        <Skeleton height={20} width={100} />
        <Skeleton height={15} width={160} />
        <Skeleton height={15} width={130} />
        <Skeleton count={3} />
      </div>
    </div>
  );
};

export default FullBlogSkeleton;
