import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { withAuth } from '@/utils/authGuard';

export const getServerSideProps = withAuth(async (_ctx, user) => {
    return { props: { user } };
  });

export default function adminHeaderMiddle({ user }) {
  return (
    <div className="admin-header-middle">
       <ProtectedRoute>
        <ProtectedLayout user={user}>
            <div className="dashboard-card">
                <div className="dashboard-card-header">
                    <h2>Gestión de Correos del Topbar</h2>
                </div>
            </div>
        </ProtectedLayout>
       </ProtectedRoute>
        
    </div>
  );
}