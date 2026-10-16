"use client";

// hooks/useAdminContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { customFetch } from "../lib/api";

export interface AdminContextValue {
  isAdmin: boolean;
  verifyAdmin: (token?: string) => Promise<void>;
  signOut: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const verifyAdmin = async (tokenOverride?: string) => {
    try {
      await customFetch("/api/admin/verify", {
        method: "GET",
        token: tokenOverride,
        skipCache: true,
      });
      setIsAdmin(true);
    } catch (err) {
      setIsAdmin(false);
      throw err;
    }
  };

  const signOut = () => {
    setIsAdmin(false);
  };

  useEffect(() => {
    let active = true;

    const verify = async () => {
      try {
        await customFetch("/api/admin/verify", {
          method: "GET",
          skipCache: true,
        });
        if (active) setIsAdmin(true);
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
