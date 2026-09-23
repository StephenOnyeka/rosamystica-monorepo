"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";
import { useAdminContext } from "@/hooks/useAdminContext";

import { customFetch } from "@/lib/api";

export default function Admin() {
  const { isAdmin, verifyAdmin, signOut } = useAdminContext();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await customFetch<{ token: string }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", data.token);
      await verifyAdmin(data.token);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await customFetch("/api/admin/logout", {
        method: "POST",
      });
      localStorage.removeItem("token");
      signOut();
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      signOut();
    }
  };
  return (
    <div className="h-screen flex-1 content-center items-center">
      <div className="container mx-auto p-4">
        {isAdmin ? (
          <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
            <div>
              <div className="flex content-center items-center gap-x-4 p-0 mb-6">
                <div className="bg-[url('/images/RMHS.jpg')] w-10 h-10 rounded-full bg-cover bg-center"></div>
                <h3 className="text-2xl font-semibold">Admin Dashboard</h3>
              </div>
              <p className="font-medium italic mb-4">
                The admin is loggedin; You want to leave?
              </p>
              <LogoutButton onLogout={handleLogout} />
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleLogin}
            className="max-w-md mx-auto p-4 bg-white rounded shadow-md"
          >
            <div className="flex items-center gap-x-4 p-0 mb-4">
              <div className="bg-[url('/images/RMHS.jpg')] w-10 h-10 rounded-full bg-cover bg-center"></div>
              <div>
                <h3 className="text-2xl font-semibold ">Admin Login</h3>
              </div>
            </div>
            <div>
              <label>Email:</label>
              <br />
              <input
                className="bg-gray-200 p-2 mb-4 w-full"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div>
              <label>Password:</label>
              <br />
              <input
                className="bg-gray-200 p-2 mb-4 w-full"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Login
            </button>{" "}
            <div className="text-center mt-2 text-sm">
              <Link
                href={"/"}
                className="flex items-center gap-x-2 hover:text-primary"
              >
                <FaArrowLeft />
                Go back
              </Link>
            </div>
            {error && (
              <div className="text-red-500 border border-red-500 bg-red-100 p-2 mt-4">
                {error}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
