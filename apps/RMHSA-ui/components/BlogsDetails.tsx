"use client";

import { useBlogsContext } from "@/hooks/useBlogsContext";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Blog } from "@/lib/types";
import { customFetch } from "@/lib/api";
import { ThrottledButton } from "@/components/ThrottledButton";

interface BlogsDetailsProps {
  blog: Blog;
}

function BlogsDetails({ blog }: BlogsDetailsProps) {
  const { dispatch } = useBlogsContext();
  const { isAdmin } = useAdminContext();

  const blogId = blog.id || blog._id || "";

  const handleClick = async () => {
    // 1. Optimistically delete from context state
    dispatch({ type: "DELETE_BLOG", payload: blog });

    try {
      // 2. Perform background delete request
      await customFetch<Blog>(`/api/blogs/${blogId}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete blog:", error);
      // 3. Rollback context state if delete fails
      dispatch({ type: "CREATE_BLOG", payload: blog });
    }
  };

  const coverImg = blog.backgroundImage || blog.coverImage || blog.image || (blog as any).titleImg;

  return (
    <div>
      <div key={blogId} className="bg-white my-6 font-poppins rounded-xl overflow-hidden">
        {coverImg && (
          <Link href={`/blogs/${blogId}`}>
            <div className="w-full h-48 md:h-60 rounded-xl overflow-hidden mb-4 bg-gray-100">
              <img
                src={coverImg as string}
                alt={blog.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}
        <p className="text-sm text-slate-400 font-normal">
          {blog.createdAt &&
            formatDistanceToNow(new Date(blog.createdAt), {
              addSuffix: true,
            })}
        </p>
        <br />
        <Link href={`/blogs/${blogId}`}>
          <p className="font-bold text-2xl hover:text-red-400">{blog.title}</p>
        </Link>
        <br />
        <p className="font-semibold">{blog.desc?.substring(0, 100)} ...</p>
        <br />
        {isAdmin && (
          <ThrottledButton
            type="button"
            className="bg-red-400 text-white px-4 py-2 rounded font-medium text-xs hover:bg-red-500"
            onClick={handleClick}
            loadingText="Deleting..."
          >
            Delete
          </ThrottledButton>
        )}
      </div>
      <hr />
    </div>
  );
}

export default BlogsDetails;