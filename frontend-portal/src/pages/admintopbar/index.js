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

// ⬇️  importa desde components, NO desde ./TopbarFormModal
import TopbarFormModal from '@/components/admin/topbar/TopbarFormModal';
import TopbarLogoFormModal from '@/components/admin/topbar/TopbarLogoFormModal';

export const getServerSideProps = withAuth(async (_ctx, user) => ({
  props: { user },
}));

export default function AdminTopbar({ user }) {
  /* ---------- correos ---------- */
  const [topbars, setTopbars] = useState([]);
  const [form, setForm] = useState({ id: null, email: '', enabled: true });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* ---------- logos ---------- */
  const [logos, setLogos] = useState([]);
  const [logoForm, setLogoForm] = useState({ id: null, file: null, enabled: true });
  const [isEditLogo, setIsEditLogo] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);

  /* ---------- cargar ---------- */
  const fetchData = async () => {
    setTopbars(await getTopbars());
    setLogos(await getTopbarLogos());
  };
  useEffect(() => { fetchData(); }, []);

  /* ---------- handlers correo ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isEdit ? await updateTopbar(form.id, form) : await createTopbar(form);
    closeModal(); fetchData();
  };

  const openEdit =  (t) => { setIsEdit(true);  setForm(t);        setShowModal(true); };
  const openNew  = () => { setIsEdit(false); setForm({ email:'', enabled:true }); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const remove = async (id) => {
    if (confirm('¿Eliminar?')) { await deleteTopbar(id); fetchData(); }
  };

  /* ---------- handlers logo ---------- */
  const handleLogoChange = (e) => {
    const { type, name, checked, files } = e.target;
    setLogoForm((p) => ({
      ...p,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : e.target.value,
    }));
  };

  const handleLogoSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('enabled', logoForm.enabled ? '1' : '0');
    if (logoForm.file) data.append('logo', logoForm.file);

    isEditLogo ? await updateTopbarLogo(logoForm.id, data) : await createTopbarLogo(data);
    closeLogoModal(); fetchData();
  };

  const openLogoEdit = (l) => {
    setIsEditLogo(true);
    setLogoForm({ id: l.id, file: null, enabled: l.enabled });
    setShowLogoModal(true);
  };
  const openLogoNew = () => { setIsEditLogo(false); setLogoForm({ file:null, enabled:true }); setShowLogoModal(true); };
  const closeLogoModal = () => setShowLogoModal(false);

  const removeLogo = async (id) => {
    if (confirm('¿Eliminar logo?')) { await deleteTopbarLogo(id); fetchData(); }
  };

  /* ---------- UI ---------- */
  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>

        {/* correos */}
        <div className="dashboard-card">
          <div className="dashboard-card-header d-flex justify-content-between">
            <h2>Correos del Topbar</h2>
            <button onClick={openNew}>+ Nuevo correo</button>
          </div>

          <table className="table mt-3">
            <thead><tr><th>ID</th><th>Correo</th><th>Activo</th><th /></tr></thead>
            <tbody>
              {topbars.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.email}</td>
                  <td>{t.enabled ? '✅' : '❌'}</td>
                  <td>
                    <button onClick={() => openEdit(t)}>✏️</button>{' '}
                    <button onClick={() => remove(t.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* logos */}
        <div className="dashboard-card mt-5">
          <div className="dashboard-card-header d-flex justify-content-between">
            <h2>Logos del Topbar</h2>
            <button onClick={openLogoNew}>+ Nuevo logo</button>
          </div>

          <table className="table mt-3">
            <thead><tr><th>ID</th><th>Preview</th><th>Activo</th><th /></tr></thead>
            <tbody>
              {logos.map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td><img src={l.url} width={80} alt="" /></td>
                  <td>{l.enabled ? '✅' : '❌'}</td>
                  <td>
                    <button onClick={() => openLogoEdit(l)}>✏️</button>{' '}
                    <button onClick={() => removeLogo(l.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* modales */}
        {showModal     && (
          <TopbarFormModal
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onClose={closeModal}
            isEdit={isEdit}
          />
        )}

        {showLogoModal && (
          <TopbarLogoFormModal
            form={logoForm}
            onChange={handleLogoChange}
            onSubmit={handleLogoSubmit}
            onClose={closeLogoModal}
            isEdit={isEditLogo}
          />
        )}

      </ProtectedLayout>
    </ProtectedRoute>
  );
}
