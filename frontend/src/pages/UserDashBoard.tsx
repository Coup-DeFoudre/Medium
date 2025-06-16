import React, { useState } from "react";
import { 
  User, 
  Edit3, 
  Trash2, 
  Plus, 
  Calendar,
  Save,
  X,
  AlertTriangle
} from "lucide-react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import Appbar from "../components/Appbar";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserDashboard: React.FC = () => {
  const { user, setUser, loading } = useUser();
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states for editing
  const [editFormData, setEditFormData] = useState({
    title: "",
    content: "",
    published: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);

  // Get posts from user context
  const posts: Post[] = user?.posts || [];

  // Start editing a post
  const handleEditPost = (post: Post) => {
    setIsEditing(post.id);
    setEditFormData({
      title: post.title,
      content: post.content,
      published: post.published,
    });
    setErrors({});
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditFormData({
      title: "",
      content: "",
      published: false,
    });
    setErrors({});
  };

  // Update post
  const handleUpdatePost = async (postId: string) => {
    setIsSaving(true);
    setErrors({});

    // Basic validation
    if (!editFormData.title.trim()) {
      setErrors({ title: "Title is required" });
      setIsSaving(false);
      return;
    }

    if (!editFormData.content.trim()) {
      setErrors({ content: "Content is required" });
      setIsSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BACKEND_URL}/api/v1/blog`,
        {
          id: postId,
          title: editFormData.title,
          content: editFormData.content
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the post in the user context
      if (user && user.posts) {
        const updatedPosts = user.posts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                title: editFormData.title,
                content: editFormData.content,
                published: editFormData.published,
                updatedAt: new Date().toISOString()
              }
            : post
        );
        
        setUser({
          ...user,
          posts: updatedPosts
        });
      }

      toast.success("Post updated successfully!");
      setIsEditing(null);
    } catch (err: any) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.error || "Failed to update post.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Show delete confirmation
  const handleShowDeleteDialog = (postId: string) => {
    setShowDeleteDialog(postId);
  };

  // Delete post
  const handleDeletePost = async (postId: string) => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BACKEND_URL}/api/v1/blog/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the post from user context
      if (user && user.posts) {
        const updatedPosts = user.posts.filter(post => post.id !== postId);
        setUser({
          ...user,
          posts: updatedPosts
        });
      }

      toast.success("Post deleted successfully!");
      setShowDeleteDialog(null);
    } catch (err: any) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.error || "Failed to delete post.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Appbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Welcome Banner */}
          <div className="bg-white rounded-lg shadow-sm mb-8 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="relative px-6 pb-6">
              <div className="absolute -top-16 left-6">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xl">
                      {getInitials(user.name)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end pt-4">
                <div className="mt-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Manage your posts and track your content performance
                  </p>
                </div>
                <Link to ="/create-blog" >
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Posts Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Posts</h2>
              <span className="text-sm text-gray-500">
                {posts.length} post{posts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start creating your first blog post to engage with your audience.
                </p>
                <Link to="/create-blog">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="border border-gray-200 rounded-lg p-6">
                    {isEditing === post.id ? (
                      // Edit mode
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={editFormData.title}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, title: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Post title"
                          />
                          {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                          </label>
                          <textarea
                            value={editFormData.content}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, content: e.target.value })
                            }
                            rows={8}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Write your post content..."
                          />
                          {errors.content && (
                            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                          )}
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`published-${post.id}`}
                            checked={editFormData.published}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, published: e.target.checked })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`published-${post.id}`} className="ml-2 text-sm text-gray-700">
                            Published
                          </label>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            onClick={handleCancelEdit}
                            disabled={isSaving}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                          >
                            <X className="w-4 h-4 mr-2 inline" />
                            Cancel
                          </button>
                          <button
                            onClick={() => handleUpdatePost(post.id)}
                            disabled={isSaving}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isSaving ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            ) : (
                              <Save className="w-4 h-4 mr-2" />
                            )}
                            {isSaving ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {post.title}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 space-x-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(post.createdAt)}
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                post.published 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {post.published ? 'Published' : 'Draft'}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEditPost(post)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleShowDeleteDialog(post.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed line-clamp-3">
                          {post.content}
                        </p>
                        {post.updatedAt !== post.createdAt && (
                          <p className="text-xs text-gray-500 mt-2">
                            Last updated: {formatDate(post.updatedAt)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Post
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteDialog(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(showDeleteDialog)}
                disabled={isDeleting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;