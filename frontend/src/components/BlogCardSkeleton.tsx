const BlogCardSkeleton = () => {
  return (
    <div className="w-full max-w-3xl px-6 py-5 rounded-md border border-gray-200 space-y-3 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-3">
        <div className="w-6 h-6 rounded-full bg-gray-300" />
        <div className="w-24 h-4 bg-gray-300 rounded" />
        <div className="w-1 h-1 bg-gray-400 rounded-full" />
        <div className="w-20 h-4 bg-gray-300 rounded" />
      </div>

      {/* Title Skeleton */}
      <div className="w-3/4 h-6 bg-gray-300 rounded" />

      {/* Content Skeleton */}
      <div className="w-full h-4 bg-gray-200 rounded" />
      <div className="w-5/6 h-4 bg-gray-200 rounded" />
      <div className="w-1/2 h-4 bg-gray-200 rounded" />

      {/* Footer Skeleton */}
      <div className="w-16 h-3 bg-gray-300 rounded" />
    </div>
  );
};

export default BlogCardSkeleton;
