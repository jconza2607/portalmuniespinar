'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';           // ←  next/router  (Pages Router)
import { getUser, logout as apiLogout } from '@/services/auth';

const AuthContext = createContext(null);
const PUBLIC_ROUTES = ['/login', '/register', '/'];

export function AuthProvider({ children }) {
  const router               = useRouter();
  const [user, setUser]      = useState(null);
  const [loading, setLoading] = useState(true);

  /* Detecta la ruta actual con router.pathname (Pages Router) */
  const pathname = router.pathname;                // Ej. '/login'

  useEffect(() => {
    // ⏩ No validamos sesión en páginas públicas
    if (PUBLIC_ROUTES.includes(pathname)) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getUser();              // GET /api/user
        setUser(data.user ?? data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [pathname]);

  /* logout global */
  const logout = async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };  

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
