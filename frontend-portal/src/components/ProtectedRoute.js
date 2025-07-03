'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';   // Pages Router
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router            = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  if (loading) return <p>Cargando…</p>;
  return children;
}
