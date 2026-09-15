/** Tiny API client + data hook — every call goes to the FastAPI backend. */
import { useEffect, useState } from 'react';

const TOKEN_KEY = 'mo_token';
const mem = new Map<string, string>();

export const tokenStore = {
  get(): string | null {
    try { return window.localStorage.getItem(TOKEN_KEY); } catch { return mem.get(TOKEN_KEY) ?? null; }
  },
  set(v: string) {
    try { window.localStorage.setItem(TOKEN_KEY, v); } catch { mem.set(TOKEN_KEY, v); }
  },
  clear() {
    try { window.localStorage.removeItem(TOKEN_KEY); } catch { mem.delete(TOKEN_KEY); }
  },
};

export async function api<T = any>(path: string, init: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const res = await fetch('/api' + path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(init.headers || {}),
    },
  });
  let body: any = null;
  try { body = await res.json(); } catch { /* no body */ }
  if (!res.ok) {
    const d = body?.detail;
    const msg = typeof d === 'string' ? d : d?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return (body?.data ?? body) as T;
}

/** GET hook with refetch. */
export function useApi<T = any>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!!path);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!path) return;
    let alive = true;
    setLoading(true);
    api<T>(path)
      .then((d) => { if (alive) { setData(d); setError(''); } })
      .catch((e) => { if (alive) setError(e instanceof Error ? e.message : 'Request failed'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [path, tick]);

  return { data, error, loading, refetch: () => setTick((t) => t + 1) };
}
