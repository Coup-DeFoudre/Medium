import { format } from "date-fns";
import Appbar from "../components/Appbar";
import BlogCard from "../components/BlogCard";
import BlogCardSkeleton from "../components/BlogCardSkeleton";
import { useBlogs } from "../hooks";

const Blogs = () => {
  const { loading, blogs } = useBlogs();

  return (
    <>
      <Appbar />
      <div className="flex justify-center px-4 mt-8">
        <div className="w-full max-w-3xl space-y-6">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <BlogCardSkeleton key={idx} />
              ))
            : blogs.map((blog) => (
              
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  authorName={blog.author.name}
                  title={blog.title}
                  content={blog.content}
                  publishedAt={format(new Date(blog.createdAt), "dd MMMM yyyy")}
                />
              ))}
        </div>
      </div>
    </>
  );
};

export default Blogs;
