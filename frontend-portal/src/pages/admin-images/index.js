"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { withAuth } from "@/utils/authGuard";
import {
  getAllSectionImages,
  createSectionImage,
  updateSectionImage,
  deleteSectionImage,
} from "@/services/images";

export const getServerSideProps = withAuth(async (_ctx, user) => ({
  props: { user },
}));

export default function AdminSectionImages({ user }) {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    section: "",
    label: "",
    image: null,
  });

  const resetForm = () => setForm({ id: null, section: "", label: "", image: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAllSectionImages();
      setLista(data);
    } catch {
      setError("Error al cargar imágenes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openNew = () => {
    resetForm();
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setForm({ ...item, image: null });
    setIsEdit(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setModalOpen(false);
  };

  const save = async () => {
    const data = new FormData();
    data.append("section", form.section);
    data.append("label", form.label);
    if (form.image instanceof File) data.append("image", form.image);

    try {
      if (isEdit) {
        await updateSectionImage(form.id, data);
      } else {
        await createSectionImage(data);
      }
      closeModal();
      fetchData();
    } catch {
      alert("Error al guardar");
    }
  };

  const remove = async (id) => {
    if (confirm("¿Eliminar imagen?")) {
      await deleteSectionImage(id);
      fetchData();
    }
  };

  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card">
          <div className="dashboard-card-header d-flex justify-content-between align-items-center">
            <h2>Gestión de Imágenes por Sección</h2>
            <button className="btn btn-primary" onClick={openNew}>+ Nueva Imagen</button>
          </div>

          {loading ? (
            <p>Cargando…</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered mt-4">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Sección</th>
                    <th>Etiqueta</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((item, i) => (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td>{item.section}</td>
                      <td>{item.label}</td>
                      <td>
                        <img src={item.image_url} className="img-thumbnail" width={100} />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openEdit(item)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => remove(item.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal */}
          {modalOpen && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{isEdit ? "Editar" : "Nueva"} Imagen</h5>
                    <button type="button" className="btn-close" onClick={closeModal} />
                  </div>

                  <div className="modal-body">
                    <input
                      className="form-control mb-2"
                      placeholder="Identificador único de la sección (ej. about-image)"
                      value={form.section}
                      onChange={(e) => setForm({ ...form, section: e.target.value })}
                    />
                    <input
                      className="form-control mb-2"
                      placeholder="Etiqueta descriptiva"
                      value={form.label}
                      onChange={(e) => setForm({ ...form, label: e.target.value })}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control mb-2"
                      onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                    />
                    <small className="text-muted">
                      Formato recomendado: JPG/PNG. Dimensiones según sección.
                    </small>
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                    <button className="btn btn-success" onClick={save}>Guardar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ProtectedLayout>
    </ProtectedRoute>
  );
}
