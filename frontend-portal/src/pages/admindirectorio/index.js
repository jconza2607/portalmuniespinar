"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { withAuth } from "@/utils/authGuard";
import {
  getDirectorios,
  createDirectorio,
  updateDirectorio,
  deleteDirectorio,
} from "@/services/directorio";

export const getServerSideProps = withAuth(async (_ctx, user) => {
  return { props: { user } };
});

export default function DirectorioPage({ user }) {
  const [directorios, setDirectorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    cargo: "",
    telefono: "",
    correo: "",
    area: "",
    orden: "",
    foto: null,
    activo: true,
    autoridad: false,
  });
  const [isEditMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

  useEffect(() => {
    loadData(1);
  }, []);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getDirectorios(page);
      const dataArray = Array.isArray(res.data) ? res.data : [];
      setDirectorios(dataArray);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
      });
    } catch (err) {
      console.error("Error cargando directorios:", err);
      setError("Error al cargar directorios");
      setDirectorios([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      loadData(page);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("cargo", formData.cargo);
    data.append("telefono", formData.telefono);
    data.append("correo", formData.correo);
    data.append("area", formData.area);
    data.append("orden", formData.orden || 0);
    data.append("activo", formData.activo ? "1" : "0");
    data.append("autoridad", formData.autoridad ? "1" : "0");

    if (formData.foto instanceof File) {
      data.append("foto", formData.foto);
    }

    try {
      if (isEditMode) {
        await updateDirectorio(formData.id, data);
      } else {
        await createDirectorio(data);
      }
      resetForm();
      await loadData(pagination.current_page);
    } catch (err) {
      console.error("Error guardando directorio", err);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      nombre: item.nombre,
      cargo: item.cargo,
      telefono: item.telefono,
      correo: item.correo,
      area: item.area,
      orden: item.orden,
      activo: item.activo,
      autoridad: item.autoridad,
      foto: null,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar este directorio?")) {
      await deleteDirectorio(id);
      await loadData(pagination.current_page);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      nombre: "",
      cargo: "",
      telefono: "",
      correo: "",
      area: "",
      orden: "",
      foto: null,
      activo: true,
      autoridad: false,
    });
    setEditMode(false);
    setShowModal(false);
  };

  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card">
          <div className="dashboard-card-header d-flex justify-content-between align-items-center">
            <h2>Directorio</h2>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              + Nuevo
            </button>
          </div>

          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Cargo</th>
                      <th>Teléfono</th>
                      <th>Correo</th>
                      <th>Área</th>
                      <th>Orden</th>
                      <th>Activo</th>
                      <th>Autoridad</th>
                      <th>Foto</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(directorios) && directorios.length > 0 ? (
                      directorios.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.nombre}</td>
                          <td>{item.cargo}</td>
                          <td>{item.telefono}</td>
                          <td>{item.correo}</td>
                          <td>{item.area}</td>
                          <td>{item.orden}</td>
                          <td>{item.activo ? "Sí" : "No"}</td>
                          <td>{item.autoridad ? "Sí" : "No"}</td>
                          <td>
                            {item.foto && (
                              <img
                                src={`http://localhost:8000/storage/${item.foto}`}
                                alt="foto"
                                width="60"
                                height="60"
                                style={{ objectFit: "cover", borderRadius: "8px" }}
                              />
                            )}
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm btn-secondary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                              >
                                Acciones
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button className="dropdown-item" onClick={() => handleEdit(item)}>
                                    Editar
                                  </button>
                                </li>
                                <li>
                                  <button className="dropdown-item text-danger" onClick={() => handleDelete(item.id)}>
                                    Eliminar
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="11" className="text-center">No hay registros</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {pagination.last_page > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small>
                    Página {pagination.current_page} de {pagination.last_page}
                  </small>
                  <div>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      disabled={pagination.current_page === 1}
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                    >
                      ← Anterior
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={pagination.current_page === pagination.last_page}
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                    >
                      Siguiente →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {showModal && (
            <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.3)", position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 1050, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">{isEditMode ? "Editar" : "Nuevo"} Directorio</h5>
                    <button type="button" className="btn-close" onClick={resetForm}></button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6 mb-2">
                          <input name="nombre" className="form-control" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-2">
                          <input name="cargo" className="form-control" placeholder="Cargo" value={formData.cargo} onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-2">
                          <input name="telefono" className="form-control" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-2">
                          <input name="correo" className="form-control" placeholder="Correo" value={formData.correo} onChange={handleChange} />
                        </div>
                        <div className="col-md-12 mb-2">
                          <input name="area" className="form-control" placeholder="Área" value={formData.area} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-2">
                          <input name="orden" type="number" className="form-control" placeholder="Orden" value={formData.orden} onChange={handleChange} />
                        </div>
                        <div className="col-md-6 mb-2">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="activo" checked={formData.activo} onChange={handleChange} />
                            <label className="form-check-label">Activo</label>
                          </div>
                        </div>
                        <div className="col-md-6 mb-2">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="autoridad" checked={formData.autoridad} onChange={handleChange} />
                            <label className="form-check-label">Es autoridad</label>
                          </div>
                        </div>
                        <div className="col-md-12 mb-2">
                          <input name="foto" type="file" className="form-control" onChange={handleChange} accept="image/*" />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancelar</button>
                      <button type="submit" className="btn btn-primary">Guardar</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </ProtectedLayout>
    </ProtectedRoute>
  );
}
