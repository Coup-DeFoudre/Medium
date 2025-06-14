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



export const useBlog = ({ id }:{id:string}) =>{
     const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState<Blog>();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setBlog(response.data.post);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch blogs:", error);
        setLoading(false); // prevent infinite loading
      });
  }, []);

  return {
    loading,
    blog,
  };

}



export const useBlogs = () => {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setBlogs(response.data.posts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch blogs:", error);
        setLoading(false); // prevent infinite loading
      });
  }, []);

  return {
    loading,
    blogs,
  };
};

