'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ProtectedLayout({ user, children }) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);
  const routeTitle = segments.length > 1
    ? `${capitalize(segments[0])} > ${capitalize(segments[1])}`
    : capitalize(segments[0] || 'Dashboard');

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <>
      {/* Topbar tipo breadcrumb */}
      <div className="topbar-white d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
        <div className="breadcrumb-text">
          <i className="icofont-home fs-5 me-2"></i>
          {routeTitle}
        </div>

        <div className="date-range d-flex align-items-center">
          <i className="icofont-calendar me-2"></i>
          <span>05/19/2025 - 06/17/2025</span>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="main-content pt-3 px-3">
        {children}
      </div>
    </>
  );
}
