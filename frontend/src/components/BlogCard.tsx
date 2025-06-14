import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  publishedAt: string;
  id:string;
}

export const Avatar = ({ name }: { name: string }) => {
  const initial = name?.[0] ?? "U";
  return (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-300 text-gray-700 text-sm font-semibold">
      {initial}
    </div>
  );
};

const BlogCard = ({ authorName, title, content, publishedAt,id }: BlogCardProps) => {
  // Estimate read time based on average reading speed: 200 words/min
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <Link to={`/blog/${id}`}>
    <div className="max-w-2xl px-4 py-5 hover:bg-gray-50 transition rounded-md border-b border-gray-200 cursor-pointer space-y-2">
      {/* Header */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Avatar name={authorName} />
        <span className="font-medium">{authorName}</span>
        <span>&#9679;</span>
        <span>{publishedAt}</span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-900 leading-snug">
        {title}
      </h2>

      {/* Content preview */}
      <p className="text-gray-700 text-sm leading-relaxed">
        {content.slice(0, 140)}{content.length > 140 ? "..." : ""}
      </p>

      {/* Read time */}
      <div className="text-xs text-gray-500">{readTime} min read</div>
    </div>
    </Link>
  );
};

export default BlogCard;
