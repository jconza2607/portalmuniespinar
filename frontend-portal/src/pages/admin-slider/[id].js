"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { withAuth } from "@/utils/authGuard";
import {
  getSlider,
  createSlider,
  updateSlider,
} from "@/services/slider";

export const getServerSideProps = withAuth(async (_ctx, user) => ({
  props: { user },
}));

export default function AdminSliderForm({ user }) {
  const router = useRouter();
  const { id } = router.query;

  const isNew = id === "new";

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

  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew && id) {
      getSlider(id).then((data) => {
        setForm({
          id: data.id,
          title: data.title || "",
          subtitle: data.subtitle || "",
          image: null,
          button_text: data.button?.text || "",
          button_link: data.button?.link || "",
          button2_text: data.button2?.text || "",
          button2_link: data.button2?.link || "",
          order: data.order || 0,
          active: true,
        });
        setLoading(false);
      }).catch(() => {
        alert("Error al cargar slider");
        router.push("/admin-slider");
      });
    }
  }, [id, isNew]);

  const handleSave = async () => {
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
      if (isNew) {
        await createSlider(data);
      } else {
        await updateSlider(id, data);
      }
      router.push("/admin-slider");
    } catch (err) {
      alert("Error al guardar");
    }
  };

  if (loading) return <p>Cargando…</p>;

  return (
    <ProtectedRoute>
      <ProtectedLayout user={user}>
        <div className="dashboard-card max-w-2xl mx-auto">
          <div className="dashboard-card-header d-flex justify-content-between align-items-center">
            <h2>{isNew ? "Nuevo Slider" : "Editar Slider"}</h2>
          </div>

          <div className="mt-4">
            <input className="form-control mb-2" placeholder="Título"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />

            <input className="form-control mb-2" placeholder="Subtítulo"
              value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />

            <input type="file" accept="image/*" className="form-control mb-2"
              onChange={e => setForm({ ...form, image: e.target.files[0] })} />

            <input className="form-control mb-2" placeholder="Texto Botón 1"
              value={form.button_text} onChange={e => setForm({ ...form, button_text: e.target.value })} />
            <input className="form-control mb-2" placeholder="Link Botón 1"
              value={form.button_link} onChange={e => setForm({ ...form, button_link: e.target.value })} />

            <input className="form-control mb-2" placeholder="Texto Botón 2"
              value={form.button2_text} onChange={e => setForm({ ...form, button2_text: e.target.value })} />
            <input className="form-control mb-2" placeholder="Link Botón 2"
              value={form.button2_link} onChange={e => setForm({ ...form, button2_link: e.target.value })} />

            <input type="number" className="form-control mb-2" placeholder="Orden"
              value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} />

            <div className="form-check mb-3">
              <input id="activo" type="checkbox" className="form-check-input"
                checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
              <label htmlFor="activo" className="form-check-label">Activo</label>
            </div>

            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={() => router.push("/admin-slider")}>Cancelar</button>
              <button className="btn btn-success" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      </ProtectedLayout>
    </ProtectedRoute>
  );
}
