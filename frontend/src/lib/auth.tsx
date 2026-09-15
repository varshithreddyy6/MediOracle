/**
 * Auth against the REAL backend (FastAPI): signup creates a hospital +
 * seeds its data; login returns a session token; /auth/me restores it.
 * Same interface as before, so pages don't change.
 */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { api, tokenStore } from './api';

export type User = {
  id: string;
  name: string;
  email: string;
  hospitalName: string;
  role: string;
};

type AuthCtx = {
  user: User | null;
  status: 'loading' | 'in' | 'out';
  signIn(email: string, password: string): Promise<User>;
  signUp(v: { name: string; email: string; password: string; hospitalName: string; role: string }): Promise<User>;
  signOut(): void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'in' | 'out'>('loading');

  // restore session on first load
  useEffect(() => {
    if (!tokenStore.get()) { setStatus('out'); return; }
    api<{ user: User }>('/auth/me')
      .then((d) => { setUser(d.user); setStatus('in'); })
      .catch(() => { tokenStore.clear(); setStatus('out'); });
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user,
    status,

    async signIn(email, password) {
      const d = await api<{ user: User; access_token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      tokenStore.set(d.access_token);
      setUser(d.user);
      setStatus('in');
      return d.user;
    },

    async signUp(v) {
      const d = await api<{ user: User; access_token: string }>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(v),
      });
      tokenStore.set(d.access_token);
      setUser(d.user);
      setStatus('in');
      return d.user;
    },

    signOut() {
      api('/auth/logout', { method: 'POST' }).catch(() => {});
      tokenStore.clear();
      setUser(null);
      setStatus('out');
    },
  }), [user, status]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
