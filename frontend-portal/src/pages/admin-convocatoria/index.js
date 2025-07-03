// ✅ pages/admin-convocatoria/index.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute   from "@/components/ProtectedRoute";
import ProtectedLayout  from "@/layouts/ProtectedLayout";
import { withAuth }     from "@/utils/authGuard";

import {
  getConvocatorias,
  createConvocatoria,
  updateConvocatoria,
  deleteConvocatoria,
} from "@/services/convocatoria";

export const getServerSideProps = withAuth(async (_ctx, user) => ({
  props: { user },
}));

export default function AdminConvocatoria({ user }) {
  /* ---------- state ---------- */
  const [lista,  setLista]        = useState([]);
  const [load,   setLoad]         = useState(true);
  const [error,  setError]        = useState(null);

  const [newModal,  setNewModal]  = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [form, setForm] = useState({
    id: null,
    titulo: "",
    descripcion_corta: "",
    fecha_cierre: "",
    activo: true,
  });

  /* ---------- helpers ---------- */
  const fetchData = async () => {
    setLoad(true);
    try {
      setLista(await getConvocatorias());
    } catch {
      setError("Error al cargar convocatorias");
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  /* ---------- crud ---------- */
  const saveConv = async () => {
    try {
      if (form.id) {
        await updateConvocatoria(form.id, form);
      } else {
        await createConvocatoria({ ...form, adjuntos: [] });
      }
      closeModals();
      fetchData();
    } catch { alert("Error al guardar"); }
  };

  const removeConv = async (id) => {
    if (confirm("¿Eliminar convocatoria?")) {
      await deleteConvocatoria(id);
      fetchData();
    }
  };

  const openNew  = () => { setForm({ id:null, titulo:"", descripcion_corta:"", fecha_cierre:"", activo:true }); setNewModal(true); };
  const openEdit = (c) => { setForm({ id:c.id, titulo:c.titulo, descripcion_corta:c.descripcion_corta||"", fecha_cierre:c.fecha_cierre||"", activo:!!c.activo }); setEditModal(true); };
  const closeModals = () => { setNewModal(false); setEditModal(false); };

  /* ---------- render ---------- */
  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card">
          <div className="dashboard-card-header d-flex justify-content-between align-items-center">
            <h2>Gestión de Convocatorias</h2>
            <button className="btn btn-primary" onClick={openNew}>+ Nueva Convocatoria</button>
          </div>

          {load ? (
            <p>Cargando…</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered mt-4">
                <thead className="table-light">
                  <tr>
                    <th>#</th><th>Título</th><th>Fecha cierre</th><th>Adjuntos</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((c,i)=>(
                    <tr key={c.id}>
                      <td>{i+1}</td>
                      <td>{c.titulo}</td>
                      <td>{c.fecha_cierre || "-"}</td>
                      <td>{c.adjuntos.length}</td>
                      <td>
                        <div className="dropdown">
                          <button className="btn btn-sm btn-secondary dropdown-toggle" data-bs-toggle="dropdown">
                            Acciones
                          </button>
                          <ul className="dropdown-menu">
                            <li><Link href={`/admin-convocatoria/${c.id}`} className="dropdown-item">Ver / Adjuntos</Link></li>
                            <li><button className="dropdown-item" onClick={()=>openEdit(c)}>Editar</button></li>
                            <li><button className="dropdown-item text-danger" onClick={()=>removeConv(c.id)}>Eliminar</button></li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* -------- modal new / edit -------- */}
          {(newModal||editModal) && (
            <div className="modal fade show d-block" tabIndex="-1" style={{background:"rgba(0,0,0,.5)"}}>
              <div className="modal-dialog"><div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{form.id ? "Editar" : "Nueva"} Convocatoria</h5>
                  <button className="btn-close" onClick={closeModals}></button>
                </div>
                <div className="modal-body">
                  <input className="form-control mb-2" placeholder="Título"
                    value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})}/>
                  <textarea className="form-control mb-2" rows={2} placeholder="Descripción corta"
                    value={form.descripcion_corta} onChange={e=>setForm({...form,descripcion_corta:e.target.value})}/>
                  <input type="date" className="form-control mb-2"
                    value={form.fecha_cierre} onChange={e=>setForm({...form,fecha_cierre:e.target.value})}/>
                  <div className="form-check">
                    <input id="activo" type="checkbox" className="form-check-input"
                      checked={form.activo} onChange={e=>setForm({...form,activo:e.target.checked})}/>
                    <label htmlFor="activo" className="form-check-label">Activo</label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModals}>Cancelar</button>
                  <button className="btn btn-success" onClick={saveConv}>Guardar</button>
                </div>
              </div></div>
            </div>
          )}
        </div>
      </ProtectedLayout>
    </ProtectedRoute>
  );
}
