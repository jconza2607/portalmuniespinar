import api from '@/lib/axios';
import { getCsrfToken } from './auth';

/* ----------  PÚBLICO  ---------- */
export async function fetchNormasEmitidas() {
  const { data } = await api.get('/api/normas-emitidas-publico');
  return data;
}

/* ----------  ADMIN (CSR + cookies) ---------- */
export async function getNormasCategorias() {
  await getCsrfToken();
  const { data } = await api.get('/api/normas-emitidas');
  return data;
}

export async function getNormasCategoria(id) {
  await getCsrfToken();
  const { data } = await api.get(`/api/normas-emitidas/${id}`);
  return data;
}

export async function createNormasCategoria(payload) {
  await getCsrfToken();
  const { data } = await api.post('/api/normas-emitidas', payload);
  return data;
}

export async function updateNormasCategoria(id, payload) {
  await getCsrfToken();
  const { data } = await api.put(`/api/normas-emitidas/${id}`, payload);
  return data;
}

export async function deleteNormasCategoria(id) {
  await getCsrfToken();
  const { data } = await api.delete(`/api/normas-emitidas/${id}`);
  return data;
}

/* ---------- ÍTEMS ---------- */
export async function createNormasItem(payload) {
  await getCsrfToken();
  const fd = new FormData();
  fd.append('normas_emitidas_category_id', payload.normas_emitidas_category_id);
  fd.append('question', payload.question);
  fd.append('answer',   payload.answer);
  if (payload.file) fd.append('file', payload.file);

  const { data } = await api.post('/api/normas-emitidas-items', fd);
  return data;
}

export async function updateNormasItem(id, payload) {
  await getCsrfToken();
  const fd = new FormData();
  fd.append('question', payload.question);
  fd.append('answer',   payload.answer);
  if (payload.file) fd.append('file', payload.file);

  const { data } = await api.post(`/api/normas-emitidas-items/${id}?_method=PUT`, fd);
  return data;
}

export async function deleteNormasItem(id) {
  await getCsrfToken();
  const { data } = await api.delete(`/api/normas-emitidas-items/${id}`);
  return data;
}
