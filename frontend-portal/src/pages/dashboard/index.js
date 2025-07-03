// src/pages/dashboard/index.js
import { useRouter } from 'next/router';         // Pages Router
import { useAuth } from '@/context/AuthContext'; // AuthContext
import { withAuth } from '@/utils/authGuard';    // SSR protector
import ProtectedLayout from '@/layouts/ProtectedLayout';

// 🟢 SSR con withAuth
export const getServerSideProps = withAuth(async (_ctx, user) => {
  return { props: { user } };
});

// 🟢 Componente DashboardPage
export default function DashboardPage({ user }) {
  const { logout } = useAuth();
  const router = useRouter();

  /* Cerrar Sesión */
  const handleLogout = async () => {
    try {
      await logout();
      // 🚨 El propio AuthContext ya redirige a /login, pero si quieres forzar:
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <ProtectedLayout user={user}>
      <div className="dashboard-card">
        <h1>Hola</h1>
      </div>
    </ProtectedLayout>
  );
}
