interface FullBlogProps {
  authorName: string;
  authorBio?: string;
  authorAvatarUrl?: string | undefined;
  title: string;
  content: string;
  publishedAt: string;
}

const FullBlog = ({
  authorName,
  authorBio,
  authorAvatarUrl,
  title,
  content,
  publishedAt,
}: FullBlogProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-10">
      
      {/* Left: Blog content */}
      <div className="flex-1 mt-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-gray-500">{publishedAt}</p>
        </div>

        <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>

      {/* Right: Author Sidebar */}
      <aside className="w-full md:h-screen md:w-64 bg-gray-50 rounded-lg p-4 shadow-sm sticky top-24 self-start overscroll-y-none ">
        <div className="flex flex-col items-center text-center space-y-4 ">
          {authorAvatarUrl ? (
            <img
              src={authorAvatarUrl}
              alt={authorName}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-4xl font-bold text-gray-700">
              {authorName[0]}
            </div>
          )}

          <h2 className="text-xl font-semibold">{authorName}</h2>
          <p className="text-gray-600 text-sm">{authorBio}</p>
        </div>
      </aside>
    </div>
  );
};

export default FullBlog;
