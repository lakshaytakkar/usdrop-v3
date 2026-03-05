import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiFetch } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

interface AccessMapEntry {
  level: string;
  teaserLimit?: number;
}

interface UnlockedItem {
  type: string;
  id: string;
}

interface AccessData {
  plan: string;
  accessMap: Record<string, AccessMapEntry>;
  unlockedContent: UnlockedItem[];
}

export function useAccessControl() {
  const { user } = useAuth();
  const [data, setData] = useState<AccessData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAccess = useCallback(async () => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }
    try {
      const res = await apiFetch('/api/access/check');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAccess();
  }, [fetchAccess]);

  const canAccessPage = useCallback((path: string): boolean => {
    if (loading) return false;
    if (!data) return true;
    const entry = data.accessMap[path];
    if (!entry) return true;
    return entry.level !== 'hidden' && entry.level !== 'locked';
  }, [data, loading]);

  const getAccessLevel = useCallback((resourceKey: string): string => {
    if (!data) return 'full';
    const entry = data.accessMap[resourceKey];
    if (!entry) return 'full';
    return entry.level;
  }, [data]);

  const getTeaserLimit = useCallback((resourceKey: string): number | undefined => {
    if (!data) return undefined;
    const entry = data.accessMap[resourceKey];
    return entry?.teaserLimit;
  }, [data]);

  const isContentUnlocked = useCallback((contentType: string, contentId: string): boolean => {
    if (!data) return false;
    return data.unlockedContent.some(item => item.type === contentType && item.id === contentId);
  }, [data]);

  const hiddenPages = useMemo(() => {
    if (!data) return new Set<string>();
    const hidden = new Set<string>();
    for (const [key, entry] of Object.entries(data.accessMap)) {
      if (entry.level === 'hidden') hidden.add(key);
    }
    return hidden;
  }, [data]);

  return {
    plan: data?.plan || 'free',
    loading,
    canAccessPage,
    getAccessLevel,
    getTeaserLimit,
    isContentUnlocked,
    hiddenPages,
    refresh: fetchAccess,
  };
}
