"use client";

import { useState, useEffect, useCallback } from "react";
import { VisitorRegistration, URLS, getAuthHeaders } from "@/utils/api";
import { toast } from "sonner";

export function useVisitors() {
  const [visitors, setVisitors] = useState<VisitorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(URLS.VISITORS, {
        headers: getAuthHeaders(),
      });

      const data = await res.json();

      // DRF pagination support
      const list =
        Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

      setVisitors(list);
    } catch (err) {
      console.error("Failed to fetch visitors", err);
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  // STATUS UPDATE
  const updateStatus = async (
    id: number,
    newStatus: VisitorRegistration["status"]
  ) => {
    try {
      setIsUpdating(true);

      const res = await fetch(`${URLS.VISITORS}${id}/`, {
        method: "PATCH",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Visitor status updated");

      await fetchVisitors();
    } catch (err) {
      toast.error("Failed to update visitor status");
    } finally {
      setIsUpdating(false);
    }
  };

  // STATS
  const stats = {
    totalVisitors: visitors.length,
    pendingVisitors: visitors.filter((v) => v.status === "pending").length,
    contactedVisitors: visitors.filter((v) => v.status === "contacted").length,
    paidVisitors: visitors.filter((v) => v.status === "paid").length,
    rejectedVisitors: visitors.filter((v) => v.status === "rejected").length,
  };

  return {
    visitors,
    loading,
    isUpdating,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    updateStatus,
    stats,
    refetch: fetchVisitors,
  };
}
