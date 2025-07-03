import api from '@/lib/axios';
import { getCsrfToken } from './auth';

/* ---------- HELPERS ---------- */
const toFD = (obj = {}) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== undefined && v !== null) fd.append(k, v);
  });
  return fd;
};

/* ---------- CONVOCATORIA ---------- */
export const getConvocatorias = async () => {
  await getCsrfToken();
  const { data } = await api.get('/api/convocatorias');
  return data;
};

export const getConvocatoria = async (id, page = 1, per = 5) => {
  await getCsrfToken();
  const { data } = await api.get(`/api/convocatorias/${id}?page=${page}&per_page=${per}`);
  return data;
};

export const createConvocatoria = async (payload) => {
  await getCsrfToken();
  const fd = toFD({
    titulo:             payload.titulo,
    descripcion_corta:  payload.descripcion_corta || '',
    fecha_cierre:       payload.fecha_cierre      || '',
    activo:             payload.activo ? '1' : '0',
  });

  if (Array.isArray(payload.adjuntos) && payload.adjuntos.length) {
    payload.adjuntos.forEach((a, i) => {
      fd.append(`adjuntos[${i}][tipo]`, a.tipo);
      fd.append(`adjuntos[${i}][file]`, a.file);
      if (a.titulo)       fd.append(`adjuntos[${i}][titulo]`, a.titulo);
      if (a.descripcion)  fd.append(`adjuntos[${i}][descripcion]`, a.descripcion);
    });
  }

  const { data } = await api.post('/api/convocatorias', fd);
  return data;
};

export const updateConvocatoria = async (id, p) => {
  await getCsrfToken();
  const fd = new FormData();
  fd.append('_method', 'PUT');               // 👈 spoof
  fd.append('titulo',             p.titulo);
  fd.append('descripcion_corta',  p.descripcion_corta ?? '');
  fd.append('fecha_cierre',       p.fecha_cierre      ?? '');
  fd.append('activo',             p.activo ? '1' : '0');

  const { data } = await api.post(`/api/convocatorias/${id}`, fd); // 👈 POST
  return data;
};

export const deleteConvocatoria = async (id) => {
  await getCsrfToken();
  const { data } = await api.delete(`/api/convocatorias/${id}`);
  return data;
};

/* ---------- ADJUNTOS ---------- */
export const createConvocatoriaAdjunto = async (p) => {
  await getCsrfToken();
  const fd = toFD({
    convocatoria_id: p.convocatoria_id,
    tipo:            p.tipo,
    file:            p.file,
    titulo:          p.titulo,
    descripcion:     p.descripcion,
  });

  const { data } = await api.post('/api/convocatoria-adjuntos', fd);
  return data;
};

export const updateConvocatoriaAdjunto = async (id, p) => {
  await getCsrfToken();
  const fd = new FormData();
  fd.append('_method', 'PUT');
  if (p.tipo)        fd.append('tipo', p.tipo);
  if (p.titulo)      fd.append('titulo', p.titulo);
  if (p.descripcion) fd.append('descripcion', p.descripcion);
  if (p.file instanceof File) {
    fd.append('file', p.file);
  }

  const { data } = await api.post(`/api/convocatoria-adjuntos/${id}`, fd); // ← spoof PUT
  return data;
};

export const deleteConvocatoriaAdjunto = async (id) => {
  await getCsrfToken();
  const { data } = await api.delete(`/api/convocatoria-adjuntos/${id}`);
  return data;
};

export const fetchConvocatorias = async () => {
  const { data } = await api.get('/api/convocatorias');
  return data;
};
