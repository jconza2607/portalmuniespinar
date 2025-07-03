import { useEffect, useState } from 'react';
import {
  getInstitucionales,
  createInstitucional,
  updateInstitucional,
  deleteInstitucional,
  activarInstitucional,
} from '@/services/institucional';

import ProtectedRoute from '@/components/ProtectedRoute';
import ProtectedLayout from '@/layouts/ProtectedLayout';
import { withAuth } from '@/utils/authGuard';

export const getServerSideProps = withAuth(async (_ctx, user) => {
  return { props: { user } };
});

export default function AdminMunicipalidadPage({ user }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ vision: '', mision: '', imagen: null });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const cargarDatos = async () => {
    const data = await getInstitucionales();
    setItems(data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirModalNuevo = () => {
    setEditingId(null);
    setForm({ vision: '', mision: '', imagen: null });
    setModalOpen(true);
  };

  const handleEdit = (item) => {
    setForm({ vision: item.vision, mision: item.mision, imagen: null });
    setEditingId(item.id);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('vision', form.vision);
    formData.append('mision', form.mision);
    if (form.imagen) formData.append('imagen', form.imagen);

    if (editingId) {
      await updateInstitucional(editingId, formData);
    } else {
      await createInstitucional(formData);
    }

    setModalOpen(false);
    setForm({ vision: '', mision: '', imagen: null });
    setEditingId(null);
    await cargarDatos();
  };

  const handleDelete = async (id) => {
    if (confirm('¿Deseas eliminar esta versión?')) {
      await deleteInstitucional(id);
      await cargarDatos();
    }
  };

  const handleActivate = async (id) => {
    await activarInstitucional(id);
    await cargarDatos();
  };

  return (
    <div className="admin-header-middle">
      <ProtectedRoute>
        <ProtectedLayout user={user}>
          <div className="dashboard-card">
            <div className="dashboard-card-header d-flex justify-content-between align-items-center mb-3">
              <h2>Gestión Institucional</h2>
              <button onClick={abrirModalNuevo} className="btn btn-primary">
                + Nueva visión
              </button>
            </div>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Visión</th>
                  <th>Misión</th>
                  <th>Imagen</th>
                  <th>Activo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.vision.slice(0, 40)}...</td>
                    <td>{item.mision.slice(0, 40)}...</td>
                    <td>
                      {item.imagen && (
                        <img src={`/storage/${item.imagen}`} alt="Institucional" width={70} />
                      )}
                    </td>
                    <td>{item.activo ? '✅' : ''}</td>
                    <td>
                    <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Acciones
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleEdit(item)}
                              >
                                Editar
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() => handleActivate(item.id)}
                              >
                                Activar
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(item.id)}
                              >
                                Eliminar
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal de creación/edición */}
            {modalOpen && (
              <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                  <div className="modal-content">
                  <form onSubmit={handleSubmit}>
                      <div className="modal-header">
                        <h5 className="modal-title">
                          {editingId ? 'Editar Versión Institucional' : 'Nueva Versión Institucional'}
                        </h5>
                        <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label>Visión:</label>
                          <textarea
                            className="form-control"
                            value={form.vision}
                            onChange={(e) => setForm({ ...form, vision: e.target.value })}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label>Misión:</label>
                          <textarea
                            className="form-control"
                            value={form.mision}
                            onChange={(e) => setForm({ ...form, mision: e.target.value })}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label>Imagen (opcional):</label>
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setForm({ ...form, imagen: e.target.files[0] })}
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                          {editingId ? 'Actualizar' : 'Guardar'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ProtectedLayout>
      </ProtectedRoute>
    </div>
  );
}
