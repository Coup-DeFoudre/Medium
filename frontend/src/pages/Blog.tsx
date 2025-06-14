import { useParams } from "react-router-dom";
import FullBlog from "../components/FullBlog";
import { useBlog } from "../hooks";
import FullBlogSkeleton from "../components/FullBlogSkeleton";
import Appbar from "../components/Appbar";
import { format } from "date-fns";

const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, blog } = useBlog({
    id: id || ""
  });


  return (
    <div>
      <Appbar />
      <div className="max-w-6xl mx-auto p-6">
        {loading || !blog ? (
          <FullBlogSkeleton />
        ) : (
          <FullBlog
            authorName={blog.author.name || "Unknown Author"}
            authorBio="Random catch phrase author write about himself for reader's attention."
            authorAvatarUrl={""}
            title={blog.title}
            content={blog.content}
            publishedAt={format(new Date(blog.createdAt), "dd MMM yyyy • hh:mm a")}
          />
        )}
      </div>
    </div>
  );
};

export default Blog;
