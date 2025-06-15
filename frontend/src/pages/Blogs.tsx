import { format } from "date-fns";
import {
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";
import { useState, useMemo } from "react";
import Appbar from "../components/Appbar";
import BlogCard from "../components/BlogCard";
import BlogCardSkeleton from "../components/BlogCardSkeleton";
import { useBlogs } from "../hooks";

type SortOption = 'newest' | 'oldest' | 'title' | 'author';

const Blogs = () => {
  const { loading, blogs, error, refetch } = useBlogs();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");

  const [visibleCount, setVisibleCount] = useState(5);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      refetch(); // Wait for refetch to complete
      setVisibleCount(5); // Reset count to initial
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy");
    } catch (error) {
      console.error("Invalid date:", dateString, error);
      return "Date unavailable";
    }
  };

  const uniqueAuthors = useMemo(() => {
    const authors = blogs.map(blog => blog.author.name).filter(Boolean);
    return Array.from(new Set(authors)).sort();
  }, [blogs]);

  const filteredAndSortedBlogs = useMemo(() => {
    let filtered = blogs.filter(blog => {
      const matchesSearch = searchTerm === "" ||
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesAuthor = selectedAuthor === "" || blog.author.name === selectedAuthor;

      return matchesSearch && matchesAuthor;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return (a.author.name || '').localeCompare(b.author.name || '');
        default:
          return 0;
      }
    });
  }, [blogs, searchTerm, selectedAuthor, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAuthor("");
    setSortBy('newest');
  };
    const hasActiveFilters = searchTerm || selectedAuthor || sortBy !== 'newest';


  return (
    <>
      <Appbar />
      <div className="flex justify-center px-4 mt-8">
        <div className="w-full max-w-3xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <div>
                
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Latest Stories</h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                Showing {Math.min(visibleCount, filteredAndSortedBlogs.length)} of {filteredAndSortedBlogs.length} stories
                 {hasActiveFilters && (
                  <span className="flex items-center justify-center gap-1 text-green-600">
                    <Filter className="w-3 h-3" />
                    Filtered
                  </span>
                )}
              </p>
             

            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-2 text-sm text-red-400 hover:text-red-600 hover:bg-gray-50 transition-colors"
                    >
                      Clear All
                    </button>
                  )}

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'text-blue-700 bg-blue-50 border-blue-200'
                    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >

                <Filter className="w-4 h-4" />
                Filters
                 <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />

              </button>
              <button
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                 
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />

                  <input
                    type="text"
                    placeholder="Search blogs, authors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

               <select
                  value={selectedAuthor}
                  onChange={(e) => setSelectedAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">All Authors ({uniqueAuthors.length})</option>
                  {uniqueAuthors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                   <option value="newest">📅 Newest First</option>
                    <option value="oldest">📅 Oldest First</option>
                    <option value="title">🔤 Title A-Z</option>
                    <option value="author">👤 Author A-Z</option>

                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Failed to load blogs
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline disabled:opacity-50"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
         {loading && (
            <div className="space-y-6">
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Loading stories...</span>
              </div>
              {Array.from({ length: 3 }).map((_, idx) => (
                <BlogCardSkeleton key={`skeleton-${idx}`} />
              ))}
            </div>
          )}


          {/* No blogs */}
          {!loading && !error && blogs.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No blog posts available
                </h3>
                <p className="text-gray-500 mb-6">
                  There are no blog posts to display at the moment.
                </p>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>
          )}


          {/* No filtered results */}
         {!loading && !error && blogs.length > 0 && filteredAndSortedBlogs.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No matching results
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or filter criteria to find more stories.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Filters
                </button>
              </div>
            </div>
          )}


          {/* Blog List */}
          {!loading && !error && filteredAndSortedBlogs.length > 0 && (
            <>
              <div className="space-y-6">
                {filteredAndSortedBlogs.slice(0, visibleCount).map(blog => (
                  <BlogCard
                    key={blog.id}
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedAt={formatDate(blog.createdAt)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {visibleCount < filteredAndSortedBlogs.length && (
                <div className="mt-8 text-center">
                  <button
                    className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={handleLoadMore}
                  >
                    Load More Stories
                  </button>
                </div>
              )}
            </>
          )}
          
        </div>
      </div>
    </>
  );
};

export default Blogs;
