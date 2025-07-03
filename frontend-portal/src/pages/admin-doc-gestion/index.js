"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { withAuth } from "@/utils/authGuard";
import {
  getDocGestionCategorias,
  deleteDocGestionCategoria,
  createDocGestionCategoria,
  updateDocGestionCategoria,
} from "@/services/docGestion";

export const getServerSideProps = withAuth(async (_ctx, user) => {
  return { props: { user } };
});

export default function AdminDocGestion({ user }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [nuevoNombreCategoria, setNuevoNombreCategoria] = useState('');

  const cargarCategorias = async () => {
    try {
      const data = await getDocGestionCategorias();
      setCategorias(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las categorías.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // ⬇️ Esto inicializa dropdowns Bootstrap al cargar categorías
  useEffect(() => {
    if (typeof window !== "undefined" && window.bootstrap) {
      const dropdowns = document.querySelectorAll('.dropdown-toggle');
      dropdowns.forEach((dropdownEl) => {
        new window.bootstrap.Dropdown(dropdownEl);
      });
    }
  }, [categorias]);

  const eliminarCategoria = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
    try {
      await deleteDocGestionCategoria(id);
      cargarCategorias();
    } catch (err) {
      alert('Error al eliminar categoría');
    }
  };

  const guardarCategoria = async () => {
    try {
      await createDocGestionCategoria({ name: categoryName });
      alert('Categoría creada correctamente');
      setModalOpen(false);
      setCategoryName('');
      cargarCategorias();
    } catch (err) {
      alert('Error al crear la categoría');
    }
  };

  const abrirModalEditar = (categoria) => {
    setCategoriaEditando(categoria);
    setNuevoNombreCategoria(categoria.name);
    setEditModalOpen(true);
  };

  const guardarEdicionCategoria = async () => {
    try {
      await updateDocGestionCategoria(categoriaEditando.id, { name: nuevoNombreCategoria });
      setEditModalOpen(false);
      setCategoriaEditando(null);
      cargarCategorias();
    } catch (err) {
      alert('Error al actualizar la categoría');
    }
  };

  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card">
          <div className="dashboard-card-header d-flex justify-content-between align-items-center">
            <h2>Gestión de Documentos de Gestión</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="btn btn-primary"
            >
              + Nueva Categoría
            </button>
          </div>

          {loading ? (
            <p>Cargando categorías...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered mt-4">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Ítems</th>
                    <th>PDFs</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat, i) => {
                    const totalItems = cat.items.length;
                    const totalConPdf = cat.items.filter(item => !!item.file_path).length;

                    return (
                      <tr key={cat.id}>
                        <td>{i + 1}</td>
                        <td>{cat.name}</td>
                        <td>{totalItems}</td>
                        <td>{totalConPdf}</td>
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
                                <Link
                                  href={`/admin-doc-gestion/${cat.id}`}
                                  className="dropdown-item"
                                >
                                  Agregar Items
                                </Link>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => abrirModalEditar(cat)}
                                >
                                  Editar nombre
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => eliminarCategoria(cat.id)}
                                >
                                  Eliminar
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal de nueva categoría */}
          {modalOpen && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Nueva Categoría</h5>
                    <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre de la categoría"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => setModalOpen(false)} className="btn btn-secondary">
                      Cancelar
                    </button>
                    <button onClick={guardarCategoria} className="btn btn-success">
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal de editar nombre */}
          {editModalOpen && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Editar Nombre de Categoría</h5>
                    <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)}></button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control"
                      value={nuevoNombreCategoria}
                      onChange={(e) => setNuevoNombreCategoria(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button onClick={() => setEditModalOpen(false)} className="btn btn-secondary">
                      Cancelar
                    </button>
                    <button onClick={guardarEdicionCategoria} className="btn btn-warning text-white">
                      Guardar Cambios
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
