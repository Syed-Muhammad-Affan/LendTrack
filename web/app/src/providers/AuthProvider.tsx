import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../lib/apiClient';
import { AuthContext } from '../context/AuthContext';
import type { AuthUser } from '../types/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Manual re-check, exposed through context — e.g. after updating profile/subscription elsewhere.
  const refreshUser = useCallback(async () => {
    try {
      const res = await apiClient.get('/auth/me');
      setUser(res.data.data);
    } catch {
      setUser(null);
    }
  }, []);

  // Initial check on mount. Defined inline (not via refreshUser) so state
  // updates happen inside an async function body, and a cleanup guard
  // prevents setState after unmount.
  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const res = await apiClient.get('/auth/me');
        if (!cancelled) setUser(res.data.data);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiClient.post('/auth/login', { email, password });
    setUser(res.data.data);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await apiClient.post('/auth/register', { name, email, password });
    setUser(res.data.data);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, login, register, logout, refreshUser }),
    [user, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}