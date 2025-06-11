import { useState, useEffect, useCallback } from "react";
import { getallCategories } from "../services/userService";
import type { Category } from "../types/category";

export const usePaginatedCategories = (initialLimit: number = 7) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(initialLimit);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await getallCategories(skip, limit);
      if (response.success && response.data) {
        setCategories((prev) => [...prev, ...response.data!]);
        setSkip((prev) => prev + limit);
        if (response.data.length < limit) setHasMore(false);
      } else {
        console.error(response.message);
      }
    } catch (error) {
      console.error("Error while fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, [skip, limit, loading, hasMore]);

  useEffect(() => {
    loadMore();
  }, []);

  return {
    categories,
    hasMore,
    loading,
    loadMore,
  };
};
