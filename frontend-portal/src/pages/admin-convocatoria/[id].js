"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { withAuth } from "@/utils/authGuard";

import {
  getConvocatoria,
  createConvocatoriaAdjunto,
  updateConvocatoriaAdjunto,
  deleteConvocatoriaAdjunto,
} from "@/services/convocatoria";

export const getServerSideProps = withAuth(async (_ctx, user) => ({ props: { user } }));

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export default function AdminConvocatoriaAdjuntos({ user }) {
  const { query } = useRouter();
  const convocatoriaId = query.id;

  const [convocatoria, setConvocatoria] = useState(null);
  const [loading, setLoading]           = useState(true);

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    id:null, tipo:"base", titulo:"", descripcion:"", file:null
  });

  const [page, setPage] = useState(1);

  const resetForm = () => setForm({ id:null, tipo:"base", titulo:"", descripcion:"", file:null });

  const fetchData = async () => {
    setLoading(true);
    const data = await getConvocatoria(convocatoriaId, page);
    setConvocatoria(data);
    setLoading(false);
  };

  useEffect(()=>{ if(convocatoriaId) fetchData(); }, [convocatoriaId, page]);

  const save = async () => {
    const payload = {
      tipo: form.tipo,
      titulo: form.titulo,
      descripcion: form.descripcion,
    };
  
    if (form.file instanceof File) {
      payload.file = form.file;
    }
  
    try {
      if (edit) {
        await updateConvocatoriaAdjunto(form.id, payload);
      } else {
        if (!form.file) { alert('Selecciona un PDF'); return; }
        await createConvocatoriaAdjunto({ ...payload, convocatoria_id: convocatoriaId });
      }
      setOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  const remove = async (id) => {
    if (!confirm('¿Eliminar adjunto?')) return;
    try {
      await deleteConvocatoriaAdjunto(id);
      fetchData();               // recarga la tabla
    } catch (e) {
      console.error(e);
      alert('No se pudo eliminar');
    }
  };
  

  const openNew  = () => { setEdit(false); resetForm(); setOpen(true); };
  const openEdit = (a) => {
    setEdit(true);
    setForm({ id:a.id, tipo:a.tipo, titulo:a.titulo||"", descripcion:a.descripcion||"", file:null });
    setOpen(true);
  };

  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card">
          <div className="dashboard-card-header d-flex justify-content-between align-items-center">
            <h2>Adjuntos de «{convocatoria?.titulo}»</h2>
            <button className="btn btn-primary" onClick={openNew}>+ Nuevo Adjunto</button>
          </div>

          {loading ? (<p>Cargando…</p>) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered mt-4">
                  <thead className="table-light">
                    <tr>
                      <th>#</th><th>Tipo</th><th>Título</th><th>PDF</th><th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {convocatoria.adjuntos.data.map((a, i) => (
                      <tr key={a.id}>
                        <td>{(convocatoria.adjuntos.from || 0) + i}</td>
                        <td>{a.tipo}</td>
                        <td>{a.titulo || "—"}</td>
                        <td>
                          <a href={`${BASE}/storage/${a.file_path}`} target="_blank" rel="noopener noreferrer">
                            Ver PDF
                          </a>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(a)}>Editar</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => remove(a.id)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginador */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <small>
                  Página {convocatoria.adjuntos.current_page} de {convocatoria.adjuntos.last_page}
                </small>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2"
                          disabled={convocatoria.adjuntos.current_page === 1}
                          onClick={() => setPage(page - 1)}>
                    ← Anterior
                  </button>
                  <button className="btn btn-sm btn-outline-secondary"
                          disabled={convocatoria.adjuntos.current_page === convocatoria.adjuntos.last_page}
                          onClick={() => setPage(page + 1)}>
                    Siguiente →
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Modal */}
          {open && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ background:"rgba(0,0,0,.5)" }}>
              <div className="modal-dialog"><div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{edit ? "Editar" : "Nuevo"} Adjunto</h5>
                  <button type="button" className="btn-close" onClick={() => { setOpen(false); resetForm(); }} />
                </div>

                <div className="modal-body">
                  <select className="form-select mb-2" value={form.tipo}
                          onChange={e => setForm({ ...form, tipo: e.target.value })}>
                    <option value="base">Bases</option>
                    <option value="cronograma">Cronograma</option>
                    <option value="fe_derratas">Fe de Erratas</option>
                    <option value="perfil">Perfiles</option>
                    <option value="comunicado">Comunicados</option>
                    <option value="otro">Otro</option>
                  </select>

                  <input className="form-control mb-2" placeholder="Título (opcional)"
                         value={form.titulo}
                         onChange={e => setForm({ ...form, titulo: e.target.value })} />

                  <textarea className="form-control mb-2" placeholder="Descripción (opcional)" rows={2}
                            value={form.descripcion}
                            onChange={e => setForm({ ...form, descripcion: e.target.value })} />

                  <input type="file" accept="application/pdf" className="form-control"
                         onChange={e => setForm({ ...form, file: e.target.files[0] })} />
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => { setOpen(false); resetForm(); }}>Cancelar</button>
                  <button className="btn btn-success" onClick={save}>Guardar</button>
                </div>
              </div></div>
            </div>
          )}
        </div>
      </ProtectedLayout>
    </ProtectedRoute>
  );
}
