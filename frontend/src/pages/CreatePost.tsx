import { useState } from "react";
import Appbar from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import toast from "react-hot-toast";
import {  useNavigate } from "react-router-dom";

const CreatePost = () => {
   const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [published, setPublished] = useState(false);

  const handlePublish = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to publish.");
      return;
    }
    if(title.length==0&&content.length==0){
      toast.error("Enter some content to publish")
      return;
    }

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
      
      navigate(`/blog/${response.data.id}`)
    } catch (error) {
      console.log("Publish error:", error);
      toast.error(
         "Something went wrong while publishing."
      );
    }
  };

  return (
    <div>
      <Appbar onPublish={handlePublish}  />
      <div className="max-w-3xl mx-auto px-6 mt-10">
        <input
          className="text-4xl font-semibold w-full outline-none placeholder-gray-400 mb-4"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full min-h-[300px] outline-none text-lg placeholder-gray-500"
          placeholder="Tell your story..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
    </div>
  );
};

export default CreatePost;
