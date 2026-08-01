import { useState, useEffect, useCallback } from 'react';
import { commentsApi } from '@/lib/api/comments';
import type { Comment, ListParams } from '@/types';

export function useComments(params?: ListParams) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await commentsApi.list(params);
      setComments(res.data);
      setCount(res.count);
    } catch (e: any) {
      setError(e?.message || 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { comments, count, loading, error, refetch: fetch };
}
