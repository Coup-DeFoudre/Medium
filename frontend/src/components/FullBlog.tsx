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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Left: Blog content */}
          <main className="flex-1 order-2 md:order-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              <header className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-1 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Blog Post</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  {title}
                </h1>
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <time className="text-sm font-medium" dateTime={publishedAt}>
                    {publishedAt}
                  </time>
                </div>
              </header>

              <article className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                {content}
              </article>
            </div>
          </main>

          {/* Right: Author Sidebar - moves to bottom on small screens */}
          <aside className="w-full md:w-72 shrink-0 order-1 md:order-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 md:sticky md:top-8 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  {authorAvatarUrl ? (
                    <img
                      src={authorAvatarUrl}
                      alt={`${authorName}'s profile picture`}
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-gray-900">
                    {authorName}
                  </h2>
                  <div className="flex items-center justify-center gap-1">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">Author</span>
                  </div>
                  {authorBio && (
                    <p className="text-gray-600 text-sm leading-relaxed mt-3 px-2">
                      {authorBio}
                    </p>
                  )}
                </div>

                <div className="w-full pt-4 border-t border-gray-100">
                  <div className="flex justify-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};


export default FullBlog;