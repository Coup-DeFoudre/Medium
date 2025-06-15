import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";


type Blog = {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
  };
  createdAt: string;
};

type BlogsResponse = {
  posts: Blog[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type BlogResponse = {
  post: Blog;
};

// Custom hook for fetching a single blog
export const useBlog = ({ id }: { id: string }) => {
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) {
        setError("Blog ID is required");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<BlogResponse>(
          `${BACKEND_URL}/api/v1/blog/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.post) {
          setBlog(response.data.post);
        } else {
          setError("Blog not found");
        }
      } catch (error) {
        console.error("Failed to fetch blog:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError("Unauthorized - please login again");
            localStorage.removeItem("token");
          } else if (error.response?.status === 404) {
            setError("Blog not found");
          } else {
            setError(error.response?.data?.error || "Failed to fetch blog");
          }
        } else {
          setError("Network error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, reloadFlag]);

  const refetch = () => {
    setReloadFlag(prev => !prev);
  };

  return {
    loading,
    blog,
    error,
    refetch,
  };
};

// Custom hook for fetching multiple blogs
export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<BlogsResponse['pagination']>();
  const [reloadFlag, setReloadFlag] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<BlogsResponse>(
          `${BACKEND_URL}/api/v1/blog/bulk`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBlogs(response.data.posts || []);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError("Unauthorized - please login again");
            localStorage.removeItem("token");
          } else {
            setError(error.response?.data?.error || "Failed to fetch blogs");
          }
        } else {
          setError("Network error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [reloadFlag]);

  const refetch = () => {
    setReloadFlag(prev => !prev);
  };

  return {
    loading,
    blogs,
    error,
    pagination,
    refetch,
  };
};

// Hook for blog operations (create, update, delete)
export const useBlogOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const createBlog = async (blogData: { title: string; content: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/blog`,
        blogData,
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to create blog"
        : "Network error occurred";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (blogData: { id: string; title: string; content: string }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.put(
        `${BACKEND_URL}/api/v1/blog`,
        blogData,
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to update blog"
        : "Network error occurred";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.delete(
        `${BACKEND_URL}/api/v1/blog/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to delete blog"
        : "Network error occurred";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
  };
};

// Hook for user's own blogs
export const useMyBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyBlogs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await axios.get<{ posts: Blog[] }>(
          `${BACKEND_URL}/api/v1/blog/my/posts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBlogs(response.data.posts || []);
      } catch (error) {
        console.error("Failed to fetch my blogs:", error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            setError("Unauthorized - please login again");
            localStorage.removeItem("token");
          } else {
            setError(error.response?.data?.error || "Failed to fetch your blogs");
          }
        } else {
          setError("Network error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  return {
    loading,
    blogs,
    error,
  };
};
