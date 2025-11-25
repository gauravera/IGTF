// src/hooks/useTeam.ts
"use client";

import { useState, useEffect, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  id: number;
  name: string;
  email: string;
  role: "manager" | "sales";
}

export function useTeam() {
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const getAuthHeader = () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // ============================
  // FETCH TEAM LIST
  // ============================
  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/team/list/`, {
        method: "GET",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("Unauthorized");
        }
        throw new Error(`Server Error: ${res.status}`);
      }

      const data = await res.json();

      // Ensure admin is visible + first in list
      const sorted = [...data].sort((a, b) => {
        if (a.role === "admin") return -1;
        if (b.role === "admin") return 1;
        return 0;
      });

      setTeam(sorted);
    } catch (err: any) {
      console.error("Fetch Team Error:", err);
      setError(err.message || "Failed to load team members.");
    } finally {
      setLoading(false);
    }
  }, []);

  // fetch on mount
  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  // ============================
  // CREATE USER
  // ============================
  const createUser = async (data: {
    name: string;
    email: string;
    role: "manager" | "sales";
  }) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/team/create/`, {
        method: "POST",
        headers: getAuthHeader(),
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Unauthorized");

      await res.json();
      await fetchTeam(); // refresh list after create
    } catch (err) {
      console.error("Create Team User Error:", err);
      setError("Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // DELETE USER
  // ============================
  const deleteUser = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/team/delete/${id}/`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!res.ok) throw new Error("Unauthorized");

      await fetchTeam(); // refresh list after delete
    } catch (err) {
      console.error("Delete Team User Error:", err);
      setError("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  return {
    team,
    loading,
    error,
    fetchTeam,
    createUser,
    deleteUser,
  };
}
