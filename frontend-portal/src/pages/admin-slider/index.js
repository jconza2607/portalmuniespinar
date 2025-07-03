"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { withAuth } from "@/utils/authGuard";
import {
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider,
} from "@/services/slider";

export const getServerSideProps = withAuth(async (_ctx, user) => ({
  props: { user },
}));

export default function AdminSlider({ user }) {
  const [lista, setLista] = useState([]);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    title: "",
    subtitle: "",
    image: null,
    button_text: "",
    button_link: "",
    button2_text: "",
    button2_link: "",
    order: 0,
    active: true,
  });

  const resetForm = () => setForm({
    id: null,
    title: "",
    subtitle: "",
    image: null,
    button_text: "",
    button_link: "",
    button2_text: "",
    button2_link: "",
    order: 0,
    active: true,
  });

  const fetchData = async () => {
    setLoad(true);
    try {
      setLista(await getSliders());
    } catch {
      setError("Error al cargar sliders");
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openNew = () => { resetForm(); setEdit(false); setOpen(true); };
  const openEdit = (s) => {
    setEdit(true);
    setForm({
      id: s.id,
      title: s.title || "",
      subtitle: s.subtitle || "",
      image: null,
      button_text: s.button?.text || "",
      button_link: s.button?.link || "",
      button2_text: s.button2?.text || "",
      button2_link: s.button2?.link || "",
      order: s.order || 0,
      active: true,
    });
    setOpen(true);
  };

  const close = () => { setOpen(false); resetForm(); };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = function () {
      if (img.width !== 1600 || img.height !== 830) {
        alert("La imagen debe ser de 1600x830 píxeles exactos.");
      } else {
        setForm({ ...form, image: file });
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const save = async () => {
    const data = new FormData();
    data.append("title", form.title);
    if (form.subtitle) data.append("subtitle", form.subtitle);
    if (form.image instanceof File) data.append("image", form.image);
    if (form.button_text) data.append("button_text", form.button_text);
    if (form.button_link) data.append("button_link", form.button_link);
    if (form.button2_text) data.append("button2_text", form.button2_text);
    if (form.button2_link) data.append("button2_link", form.button2_link);
    data.append("order", form.order);
    data.append("active", form.active ? "1" : "0");

    try {
      if (edit) {
        await updateSlider(form.id, data);
      } else {
        await createSlider(data);
      }
      close();
      fetchData();
    } catch {
      alert("Error al guardar");
    }
  };

  const remove = async (id) => {
    if (confirm("¿Eliminar slider?")) {
      await deleteSlider(id);
      fetchData();
    }
  };

  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card">
          <div className="dashboard-card-header d-flex justify-content-between align-items-center">
            <h2>Gestión de Sliders</h2>
            <button className="btn btn-primary" onClick={openNew}>+ Nuevo Slider</button>
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
                    <th>#</th><th>Título</th><th>Imagen</th><th>Orden</th><th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td>{s.title}</td>
                      <td><img src={s.image_url} alt="" className="img-thumbnail" width={100} /></td>
                      <td>{s.order}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEdit(s)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => remove(s.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Modal */}
          {open && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,.5)" }}>
              <div className="modal-dialog"><div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{edit ? "Editar" : "Nuevo"} Slider</h5>
                  <button type="button" className="btn-close" onClick={close} />
                </div>

                <div className="modal-body">
                  <input className="form-control mb-2" placeholder="Título"
                    value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  <input className="form-control mb-2" placeholder="Subtítulo"
                    value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />

                  <div className="mb-2">
                    <label className="form-label">Imagen (1600×830 px)</label>
                    <input type="file" accept="image/*" className="form-control" onChange={handleImage} />
                  </div>

                  <input className="form-control mb-2" placeholder="Texto Botón 1"
                    value={form.button_text} onChange={e => setForm({ ...form, button_text: e.target.value })} />
                  <input className="form-control mb-2" placeholder="Link Botón 1"
                    value={form.button_link} onChange={e => setForm({ ...form, button_link: e.target.value })} />

                  <input className="form-control mb-2" placeholder="Texto Botón 2"
                    value={form.button2_text} onChange={e => setForm({ ...form, button2_text: e.target.value })} />
                  <input className="form-control mb-2" placeholder="Link Botón 2"
                    value={form.button2_link} onChange={e => setForm({ ...form, button2_link: e.target.value })} />

                  <input type="number" className="form-control mb-2" placeholder="Orden"
                    value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />

                  <div className="form-check mb-3">
                    <input type="checkbox" id="activo" className="form-check-input"
                      checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
                    <label htmlFor="activo" className="form-check-label">Activo</label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={close}>Cancelar</button>
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
