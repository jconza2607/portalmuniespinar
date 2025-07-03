// ✅ pages/admin-doc-gestion/[id].js
"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { withAuth } from "@/utils/authGuard";
import {
  getDocGestionCategoria,
  createDocGestionItem,
  updateDocGestionItem,
  deleteDocGestionItem,
} from "@/services/docGestion";

export const getServerSideProps = withAuth(async (_ctx, user) => {
  return { props: { user } };
});

export default function AdminDocGestionItems({ user }) {
  const router = useRouter();
  const { id } = router.query;

  const [categoria, setCategoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    question: "",
    answer: "",
    file: null,
  });

  const cargarCategoria = async () => {
    try {
      const data = await getDocGestionCategoria(id);
      setCategoria(data);
    } catch (err) {
      alert("Error al cargar la categoría");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) cargarCategoria();
  }, [id]);

  const abrirModalNuevo = () => {
    setFormData({ id: null, question: "", answer: "", file: null });
    setIsEditMode(false);
    setModalOpen(true);
  };

  const abrirModalEditar = (item) => {
    setFormData({
      id: item.id,
      question: item.question,
      answer: item.answer,
      file: null,
    });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const guardarItem = async () => {
    try {
      const payload = {
        question: formData.question,
        answer: formData.answer,
        file: formData.file,
      };

      if (isEditMode) {
        await updateDocGestionItem(formData.id, payload);
      } else {
        payload.doc_gestion_category_id = id;
        await createDocGestionItem(payload);
      }

      setModalOpen(false);
      setFormData({ id: null, question: "", answer: "", file: null });
      cargarCategoria();
    } catch (err) {
      alert("Error al guardar el ítem");
    }
  };

  const eliminarItem = async (itemId) => {
    if (!confirm("¿Seguro que deseas eliminar este ítem?")) return;
    try {
      await deleteDocGestionItem(itemId);
      cargarCategoria();
    } catch (err) {
      alert("Error al eliminar");
    }
  };

  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card">
          <div className="dashboard-card-header d-flex justify-content-between align-items-center">
            <h2>Ítems de Categoría: {categoria?.name}</h2>
            <button
              onClick={abrirModalNuevo}
              className="btn btn-primary"
            >
              + Nuevo Ítem
            </button>
          </div>

          {loading ? (
            <p>Cargando ítems...</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered mt-4">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Pregunta</th>
                    <th>Respuesta</th>
                    <th>PDF</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categoria.items.map((item, i) => (
                    <tr key={item.id}>
                      <td>{i + 1}</td>
                      <td>{item.question}</td>
                      <td>{item.answer}</td>
                      <td>
                        {item.file_path && (
                          <a
                            href={`http://localhost:8000/storage/${item.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Ver PDF
                          </a>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => abrirModalEditar(item)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarItem(item.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal para nuevo/editar ítem */}
          {modalOpen && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {isEditMode ? "Editar Ítem" : "Nuevo Ítem"}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setModalOpen(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Pregunta"
                      value={formData.question}
                      onChange={(e) =>
                        setFormData({ ...formData, question: e.target.value })
                      }
                    />
                    <textarea
                      className="form-control mb-2"
                      placeholder="Respuesta"
                      rows={3}
                      value={formData.answer}
                      onChange={(e) =>
                        setFormData({ ...formData, answer: e.target.value })
                      }
                    />
                    <input
                      type="file"
                      accept="application/pdf"
                      className="form-control"
                      onChange={(e) =>
                        setFormData({ ...formData, file: e.target.files[0] })
                      }
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn btn-success"
                      onClick={guardarItem}
                    >
                      Guardar
                    </button>
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
