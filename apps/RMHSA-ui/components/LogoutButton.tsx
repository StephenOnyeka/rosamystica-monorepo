"use client";

import { useRouter } from "next/navigation";

import { customFetch } from "@/lib/api";

interface LogoutButtonProps {
  onLogout: () => void;
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await customFetch("/api/admin/logout", {
        method: "POST",
      });

      localStorage.removeItem("token");
      onLogout();
      router.push("/admin");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
      onLogout();
      router.push("/admin");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded w-full"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
