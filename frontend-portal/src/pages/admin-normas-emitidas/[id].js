"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { withAuth } from "@/utils/authGuard";
import {
  getNormasCategoria,
  createNormasItem,
  updateNormasItem,
  deleteNormasItem,
} from "@/services/normasEmitidas";

export const getServerSideProps = withAuth(async (_ctx, user) => ({
  props: { user },
}));

export default function AdminNormasEmitidasItems({ user }) {
  const { query } = useRouter();
  const categoryId = query.id;

  const [categoria, setCategoria]   = useState(null);
  const [loading,   setLoading]     = useState(true);
  const [modal,     setModal]       = useState(false);
  const [edit,      setEdit]        = useState(false);
  const [form,      setForm]        = useState({ id:null, question:"", answer:"", file:null });

  useEffect(() => { if (categoryId) fetchData(); }, [categoryId]);

  const fetchData = async () => {
    setLoading(true);
    setCategoria(await getNormasCategoria(categoryId));
    setLoading(false);
  };

  const handleSave = async () => {
    const payload = {
      question: form.question,
      answer:   form.answer,
      file:     form.file,
    };
    if (edit) {
      await updateNormasItem(form.id, payload);
    } else {
      payload.normas_emitidas_category_id = categoryId;
      await createNormasItem(payload);
    }
    setModal(false);
    setForm({ id:null, question:"", answer:"", file:null });
    fetchData();
  };

  const openNew  = () => { setEdit(false); setForm({ id:null, question:"", answer:"", file:null }); setModal(true); };
  const openEdit = (it) => { setEdit(true);  setForm({ id:it.id, question:it.question, answer:it.answer, file:null }); setModal(true); };

  const remove = async (id) => {
    if (confirm("¿Eliminar ítem?")) {
      await deleteNormasItem(id);
      fetchData();
    }
  };

  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card">
          <div className="dashboard-card-header d-flex justify-content-between align-items-center">
            <h2>Ítems de: {categoria?.name}</h2>
            <button className="btn btn-primary" onClick={openNew}>+ Nuevo Ítem</button>
          </div>

          {loading ? (<p>Cargando…</p>) : (
            <div className="table-responsive">
              <table className="table table-bordered mt-4">
                <thead className="table-light">
                  <tr><th>#</th><th>Pregunta</th><th>Respuesta</th><th>PDF</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                  {categoria.items.map((it,i)=>(
                    <tr key={it.id}>
                      <td>{i+1}</td>
                      <td>{it.question}</td>
                      <td>{it.answer}</td>
                      <td>{it.file_path && (
                        <a href={`http://localhost:8000/storage/${it.file_path}`} target="_blank">Ver PDF</a>
                      )}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>openEdit(it)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={()=>remove(it.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal */}
          {modal && (
            <div className="modal fade show d-block" tabIndex="-1" style={{background:"rgba(0,0,0,.5)"}}>
              <div className="modal-dialog"><div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{edit?"Editar":"Nuevo"} Ítem</h5>
                  <button type="button" className="btn-close" onClick={()=>setModal(false)}></button>
                </div>
                <div className="modal-body">
                  <input className="form-control mb-2" placeholder="Pregunta"
                         value={form.question} onChange={e=>setForm({...form,question:e.target.value})}/>
                  <textarea className="form-control mb-2" rows={3} placeholder="Respuesta"
                         value={form.answer} onChange={e=>setForm({...form,answer:e.target.value})}/>
                  <input type="file" accept="application/pdf" className="form-control"
                         onChange={e=>setForm({...form,file:e.target.files[0]})}/>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={()=>setModal(false)}>Cancelar</button>
                  <button className="btn btn-success"   onClick={handleSave}>Guardar</button>
                </div>
              </div></div>
            </div>
          )}
        </div>
      </ProtectedLayout>
    </ProtectedRoute>
  );
}
