import { useState, useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(fetchFn, pageSize = 10) {
  const [items, setItems]     = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const pageRef               = useRef(1);
  const loadingRef            = useRef(false);
  const hasMoreRef            = useRef(true);
  const sentinelRef           = useRef(null);
  const observerRef           = useRef(null);

  const load = useCallback(async (p) => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const res = await fetchFn(p, pageSize);
      const newItems =
        res.data?.data ||
        res.data?.drivers ||
        res.data ||
        [];
      if (newItems.length < pageSize) {
        hasMoreRef.current = false;
        setHasMore(false);
      }
      setItems((prev) => (p === 1 ? newItems : [...prev, ...newItems]));
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [fetchFn, pageSize]);

  useEffect(() => { load(1); }, [load]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMoreRef.current && !loadingRef.current) {
        pageRef.current += 1;
        load(pageRef.current);
      }
    });
    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [load]);

  return { items, loading, hasMore, sentinelRef };
}