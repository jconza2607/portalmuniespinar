import ProtectedRoute from '@/components/ProtectedRoute';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <main>
        <h1>Configuración</h1>
        <p>Aquí puedes cambiar tus preferencias.</p>
      </main>
    </ProtectedRoute>
  );
}
