"use client";

import { useBlogsContext } from "@/hooks/useBlogsContext";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useAdminContext } from "@/hooks/useAdminContext";
import type { Blog } from "@/lib/types";

interface BlogsDetailsProps {
  blog: Blog;
}

import { customFetch } from "@/lib/api";

function BlogsDetails({ blog }: BlogsDetailsProps) {
  const { dispatch } = useBlogsContext();
  const { isAdmin } = useAdminContext();

  const blogId = blog.id || blog._id || "";

  const handleClick = async () => {
    try {
      const json = await customFetch<Blog>(`/api/blogs/${blogId}`, {
        method: "DELETE",
      });
      dispatch({ type: "DELETE_BLOG", payload: json });
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  return (
    <div>
      {/* How the blogs render in an array of all blogs */}

      <div key={blogId} className="bg-white my-4 font-poppins">
        {/* <img src={blog.titleImg} alt="Preview" width={500} height={500} /> */}
        <p className="text-sm text-slate-400 font-normal">
          {formatDistanceToNow(new Date(blog.createdAt), {
            addSuffix: true,
          })}
        </p>
        <br />
        <Link href={`/blogs/${blogId}`}>
          <p className=" font-bold text-2xl hover:text-red-400">{blog.title}</p>
        </Link>
        <br />
        <p className="font-semibold">{blog.desc.substring(0, 100)} ...</p>
        <br />
        {isAdmin && (
          <button
            className="bg-red-400 px-4 py-2 rounded font-medium text-xs hover:bg-green-400"
            onClick={handleClick}
          >
            Delete
          </button>
        )}
      </div>
      <hr />
    </div>
  );
}

export default BlogsDetails;
