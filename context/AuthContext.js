
// context/AuthContext.js
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const router = useRouter();

  // -----------------------------------
  // Check authentication on app load
  // -----------------------------------
  useEffect(() => {
    checkAuth();
  }, []);

  // -----------------------------------
  // Verify session from backend
  // -----------------------------------
  const checkAuth = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
        {
          method: "GET",

          // IMPORTANT:
          // send HttpOnly cookies
          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",

            "X-API-Version": "1",
          },
        }
      );

      if (!response.ok) {
        setUser(null);
        return;
      }

      const userData =
        await response.json();

      setUser(userData.data);

    } catch (error) {
      console.error(
        "Auth check failed:",
        error
      );

      setUser(null);

    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // Logout
  // -----------------------------------
  const logout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",

            "X-API-Version": "1",
          },
        }
      );

    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );

    } finally {
      setUser(null);

      router.push("/login");
    }
  };

  // -----------------------------------
  // Context value
  // -----------------------------------
  const value = {
    user,
    loading,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

// -----------------------------------
// Hook
// -----------------------------------
export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}

