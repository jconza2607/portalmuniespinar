'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import {
  fetchMenu,
  createMenu,
  updateMenu,
  deleteMenu,
} from '@/services/menu';

import MenuFormModal from './MenuFormModal';
import MenuTable from './MenuTable';
import { withAuth } from '@/utils/authGuard';

export const getServerSideProps = withAuth(async (_ctx, user) => {
  return { props: { user } };
});

export default function MenuPage({ user }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    id: null,
    label: '',
    href: '',
    icon: '',
    parent_id: null,
    enabled: true,
  });

  const resetForm = () =>
    setForm({
      id: null,
      label: '',
      href: '',
      icon: '',
      parent_id: null,
      enabled: true,
    });

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMenu();
        setMenus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'parent_id' && value !== ''
          ? Number(value)
          : value === ''
          ? null
          : value,
    }));
  };

  const handleEdit = (menu) => {
    setForm({
      id: menu.id,
      label: menu.label,
      href: menu.href ?? '',
      icon: menu.icon ?? '',
      parent_id: menu.parent_id ?? null,
      enabled: menu.enabled,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este menú?')) return;
    try {
      await deleteMenu(id);
      setMenus((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let newMenu;
      if (form.id) {
        newMenu = await updateMenu(form.id, form);
        setMenus((prev) =>
          prev.map((m) => (m.id === newMenu.id ? newMenu : m))
        );
      } else {
        newMenu = await createMenu(form);
        setMenus((prev) => [...prev, newMenu]);
      }
      setModalOpen(false);
      resetForm();
    } catch (err) {
      alert(err.message);
    }
  };

  const parentOptions = menus.filter(
    (m) => m.parent_id === null && m.id !== form.id
  );

  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card">
          <h1>Gestión de Menús</h1>
            <button className="btn btn-primary mb-3" onClick={() => setModalOpen(true)}>
              Crear Nuevo Menú
            </button>

            {loading && <p>Cargando menús…</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && (
              <MenuTable
                menus={menus}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {modalOpen && (
              <MenuFormModal
                form={form}
                parentOptions={parentOptions}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                onClose={() => setModalOpen(false)}
                isEdit={!!form.id}
                resetForm={resetForm}
              />
            )}
        </div>        
      </ProtectedLayout>
    </ProtectedRoute>
  );
}
