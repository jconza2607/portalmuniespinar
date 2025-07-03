"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { withAuth } from "@/utils/authGuard";
import {
  getOrganigramas,
  createOrganigrama,
  updateOrganigrama,
  deleteOrganigrama,
} from "@/services/organigrama";

export const getServerSideProps = withAuth(async (_ctx, user) => {
  return { props: { user } };
});

export default function AdminOrganigrama({ user }) {
  const [organigramas, setOrganigramas] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    parent_id: "",
    orden: 0,
    activo: true,
  });
  const [isEditMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadOrganigramas();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.bootstrap) {
      const dropdowns = document.querySelectorAll(".dropdown-toggle");
      dropdowns.forEach((el) => new window.bootstrap.Dropdown(el));
    }
  }, [organigramas]);

  const loadOrganigramas = async () => {
    try {
      const data = await getOrganigramas();
      setOrganigramas(data);
    } catch (error) {
      console.error("Error al cargar organigrama:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateOrganigrama(formData.id, formData);
      } else {
        await createOrganigrama(formData);
      }
      resetForm();
      await loadOrganigramas();
    } catch (error) {
      console.error("Error guardando organigrama:", error);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      nombre: item.nombre,
      parent_id: item.parent_id || "",
      orden: item.orden,
      activo: item.activo,
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("¿Deseas eliminar este nodo del organigrama?")) {
      await deleteOrganigrama(id);
      await loadOrganigramas();
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      nombre: "",
      parent_id: "",
      orden: 0,
      activo: true,
    });
    setEditMode(false);
    setShowModal(false);
  };

  const renderOrganigramaRows = (items, level = 0) => {
    return items.flatMap((item) => {
      const row = (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{"—".repeat(level) + " " + item.nombre}</td>
          <td>{item.parent_id || "—"}</td>
          <td>{item.orden}</td>
          <td>{item.activo ? "Sí" : "No"}</td>
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
                  <button className="dropdown-item" onClick={() => handleEdit(item)}>
                    Editar
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
        </tr>
      );

      const children = item.children_recursive || item.children || [];
      const childRows = children.length > 0 ? renderOrganigramaRows(children, level + 1) : [];

      return [row, ...childRows];
    });
  };

  const renderParentOptions = (items, level = 0) => {
    return items.flatMap((item) => {
      const option = (
        <option key={item.id} value={item.id}>
          {"—".repeat(level) + " " + item.nombre}
        </option>
      );

      const children = item.children_recursive || item.children || [];
      const childOptions = children.length > 0
        ? renderParentOptions(children, level + 1)
        : [];

      return [option, ...childOptions];
    });
  };

  return (
    <div className="admin-header-middle">
      <ProtectedRoute>
        <ProtectedLayout user={user}>
          <div className="dashboard-card">
            <div className="dashboard-card-header d-flex justify-content-between align-items-center">
              <h2>Gestión del Organigrama Institucional</h2>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                + Nuevo
              </button>
            </div>

            <div className="table-responsive mt-3">
              <table className="table table-bordered table-hover table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Padre</th>
                    <th>Orden</th>
                    <th>Activo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {organigramas.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No hay registros.
                      </td>
                    </tr>
                  ) : (
                    renderOrganigramaRows(organigramas)
                  )}
                </tbody>
              </table>
            </div>

            {showModal && (
              <div
                className="modal show d-block"
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  zIndex: 1050,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{isEditMode ? "Editar" : "Nuevo"} Nodo</h5>
                      <button type="button" className="btn-close" onClick={resetForm}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <input
                            name="nombre"
                            className="form-control"
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <select
                            name="parent_id"
                            className="form-control"
                            value={formData.parent_id}
                            onChange={handleChange}
                          >
                            <option value="">Sin padre (nivel raíz)</option>
                            {renderParentOptions(organigramas)}
                          </select>
                        </div>
                        <div className="mb-3">
                          <input
                            type="number"
                            name="orden"
                            className="form-control"
                            placeholder="Orden"
                            value={formData.orden}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-check mb-3">
                          <input
                            type="checkbox"
                            name="activo"
                            checked={formData.activo}
                            onChange={handleChange}
                            className="form-check-input"
                            id="activoCheck"
                          />
                          <label className="form-check-label" htmlFor="activoCheck">
                            Activo
                          </label>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={resetForm}>
                          Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Guardar
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
