"use client";

import {
  createContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { Blog } from "@/lib/types";

export interface BlogsState {
  blogs: Blog[] | null;
}

export type BlogsAction =
  | { type: "SET_BLOGS"; payload: Blog[] }
  | { type: "CREATE_BLOG"; payload: Blog }
  | { type: "DELETE_BLOG"; payload: Blog }
  | { type: "UPDATE_BLOG"; payload: Blog };

export interface BlogsContextValue extends BlogsState {
  dispatch: Dispatch<BlogsAction>;
}

export const BlogsContext = createContext<BlogsContextValue | null>(null);

export const blogsReducer = (
  state: BlogsState,
  action: BlogsAction,
): BlogsState => {
  switch (action.type) {
    case "SET_BLOGS":
      return { blogs: action.payload };
    case "CREATE_BLOG":
      return { blogs: [action.payload, ...(state.blogs ?? [])] };
    case "DELETE_BLOG": {
      const targetId = action.payload._id || action.payload.id;
      return {
        blogs: (state.blogs ?? []).filter(
          (w) => (w._id || w.id) !== targetId,
        ),
      };
    }
    case "UPDATE_BLOG": {
      const targetId = action.payload._id || action.payload.id;
      return {
        blogs: (state.blogs ?? []).map((blog) =>
          (blog._id || blog.id) === targetId ? action.payload : blog,
        ),
      };
    }
    default:
      return state;
  }
};

export const BlogsContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(blogsReducer, {
    blogs: null,
  });
  return (
    <BlogsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BlogsContext.Provider>
  );
};
