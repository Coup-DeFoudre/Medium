import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, BookOpen, Sparkles, Send, X, Check, Edit3 } from "lucide-react";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const updateWordCount = (text: string) => {
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  };

  const handlePublish = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in to publish.");
      return;
    }
    if (title.length == 0 || content.length == 0) {
      toast.error("Enter some content to publish");
      return;
    }
    setShowConfirmDialog(true);
  };
  const confirmPublish = async () => {
    setShowConfirmDialog(false);
    setIsPublishing(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Post published successfully!");
      console.log("Post response:", response.data);

      navigate(`/blog/${response.data.id}`);
    } catch (error) {
      console.log("Publish error:", error);
      toast.error("Something went wrong while publishing.");
    } finally {
      setIsPublishing(false);
    }
  };
  const getReadingTime = (): number => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Create New Post
                </h1>
                <p className="text-sm text-gray-500">
                  Share your thoughts with the world
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Link to="/blogs" className="hover:underline">
                  <span>{` <-`} Back to Blogs</span>
                </Link>
                <span className="text-gray-400">|</span>
              </div>

              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Words</p>
                <p className="text-lg font-semibold text-gray-900">
                  {wordCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Characters</p>
                <p className="text-lg font-semibold text-gray-900">
                  {title.length + content.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Reading Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {getReadingTime()} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Title Input */}
            <div className="mb-8">
              <input
                className="text-4xl md:text-5xl font-bold w-full outline-none placeholder-gray-400 bg-transparent"
                placeholder="Your title goes here..."
                value={title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTitle(e.target.value)
                }
                disabled={isPublishing}
              />
              <div className="mt-2 text-sm text-gray-500">
                {title.length > 0 && `${title.length} characters`}
              </div>
            </div>

            {/* Content Textarea */}
            <div className="relative">
              <textarea
                className="w-full min-h-[400px] outline-none text-lg leading-relaxed placeholder-gray-500 bg-transparent resize-none"
                placeholder="Start writing your story... ✨

You can write about anything that inspires you. Share your experiences, insights, or creative ideas with the world."
                value={content}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setContent(e.target.value);
                  updateWordCount(e.target.value);
                }}
                disabled={isPublishing}
              />

              {content.length === 0 && (
                <div className="absolute bottom-4 right-4 text-gray-400">
                  <Sparkles className="w-6 h-6" />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50/50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>💡 Tip: Use engaging headlines to capture attention</span>
              </div>
              <div>Last edited: just now</div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Ready to Publish?
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Your post will be published and visible to all readers. Make sure
              everything looks perfect!
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Title:</span>
                <span className="font-medium text-gray-900 truncate ml-2">
                  {title || "Untitled"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Word count:</span>
                <span className="font-medium text-gray-900">
                  {wordCount} words
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>

              <button
                onClick={confirmPublish}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Check className="w-4 h-4" />
                <span>Publish Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isPublishing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Publishing Your Post
            </h3>
            <p className="text-gray-600">This won't take long...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePost;
