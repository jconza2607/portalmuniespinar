// pages/settings/index.js
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Settings() {
  return (
    <ProtectedRoute>
      <h1>Configuración</h1>
    </ProtectedRoute>
  );
}
