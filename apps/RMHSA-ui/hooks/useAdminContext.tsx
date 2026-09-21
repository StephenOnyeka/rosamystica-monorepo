"use client";

// hooks/useAdminContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface AdminContextValue {
  isAdmin: boolean;
  verifyAdmin: (token: string) => Promise<void>;
  signOut: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const verifyAdmin = async (token: string) => {
    try {
      // const response = await fetch("http://localhost:5000/api/admin/verify", {
      const response = await fetch(
        "https://rmhsa-servered.vercel.app/api/admin/verify",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setIsAdmin(response.ok);
    } catch {
      setIsAdmin(false);
    }
  };

  const signOut = () => {
    setIsAdmin(false);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    let active = true;

    const verify = async () => {
      try {
        const response = await fetch(
          "https://rmhsa-servered.vercel.app/api/admin/verify",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          },
        );
        if (active) setIsAdmin(response.ok);
      } catch {
        if (active) setIsAdmin(false);
      }
    };

    verify();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, verifyAdmin, signOut }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};
