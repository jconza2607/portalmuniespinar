'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import { withAuth } from '@/utils/authGuard';
import {
  getTopbars,
  createTopbar,
  updateTopbar,
  deleteTopbar,
} from '@/services/topbar';
import {
  getTopbarLogos,
  createTopbarLogo,
  updateTopbarLogo,
  deleteTopbarLogo,
} from '@/services/topbarLogo';
import TopbarFormModal from './TopbarFormModal';
import TopbarLogoFormModal from './TopbarLogoFormModal'; // 👈 Crea este también

export const getServerSideProps = withAuth(async (_ctx, user) => {
  return { props: { user } };
});

export default function AdminTopbar({ user }) {
  // Topbar (correo)
  const [topbars, setTopbars] = useState([]);
  const [form, setForm] = useState({ email: '', enabled: true });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // TopbarLogo (logo)
  const [logos, setLogos] = useState([]);
  const [logoForm, setLogoForm] = useState({ file: null, enabled: true });
  const [isEditLogo, setIsEditLogo] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  const fetchData = async () => {
    setTopbars(await getTopbars());
    setLogos(await getTopbarLogos());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- TOPBAR ----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEdit) {
      await updateTopbar(form.id, form);
    } else {
      await createTopbar(form);
    }
    fetchData();
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEdit(false);
    setForm({ email: '', enabled: true });
  };

  const handleEdit = (topbar) => {
    setForm(topbar);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este correo?')) {
      await deleteTopbar(id);
      fetchData();
    }
  };

  // ---------------- LOGO ----------------
  const handleLogoChange = (e) => {
    const { name, type, checked, files } = e.target;
    if (type === 'file') {
      setLogoForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setLogoForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : e.target.value }));
    }
  };

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('enabled', logoForm.enabled ? '1' : '0');
    if (logoForm.file) formData.append('logo', logoForm.file);

    if (isEditLogo) {
      await updateTopbarLogo(logoForm.id, formData);
    } else {
      await createTopbarLogo(formData);
    }
    fetchData();
    closeLogoModal();
  };

  const handleLogoEdit = (logo) => {
    setLogoForm({ id: logo.id, file: null, enabled: logo.enabled });
    setIsEditLogo(true);
    setShowLogoModal(true);
  };

  const handleLogoDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este logo?')) {
      await deleteTopbarLogo(id);
      fetchData();
    }
  };

  const closeLogoModal = () => {
    setShowLogoModal(false);
    setIsEditLogo(false);
    setLogoForm({ file: null, enabled: true });
  };

  // ---------------- RENDER ----------------
  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2>Correos del Topbar</h2>
            <button onClick={() => setShowModal(true)}>➕ Nuevo correo</button>
          </div>
          <div className="dashboard-card-body">
            <table className="table mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Correo</th>
                  <th>Habilitado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {topbars.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.email}</td>
                    <td>{t.enabled ? '✅' : '❌'}</td>
                    <td>
                      <button onClick={() => handleEdit(t)}>✏️</button>{' '}
                      <button onClick={() => handleDelete(t.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {showModal && (
            <TopbarFormModal
              form={form}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onClose={closeModal}
              isEdit={isEdit}
            />
          )}        
        </div>
      </ProtectedLayout>
    </ProtectedRoute>
  );
}
