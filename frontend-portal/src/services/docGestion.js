import api from '@/lib/axios';
import { getCsrfToken } from './auth';

// 🟢 Pública: obtener documentos agrupados por categoría
export async function fetchDocGestion() {
  const response = await api.get('/api/doc-gestion');
  return response.data;
}

// 🔒 Obtener todas las categorías con ítems
export async function getDocGestionCategorias() {
  await getCsrfToken();
  const response = await api.get('/api/doc-gestion');
  return response.data;
}

// 🔒 Ver categoría específica con sus ítems
export async function getDocGestionCategoria(id) {
  await getCsrfToken();
  const response = await api.get(`/api/doc-gestion/${id}`);
  return response.data;
}

// 🔒 Crear nueva categoría
export async function createDocGestionCategoria(data) {
  await getCsrfToken();
  const response = await api.post('/api/doc-gestion', data);
  return response.data;
}

// 🔒 Actualizar categoría
export async function updateDocGestionCategoria(id, data) {
  await getCsrfToken();
  const response = await api.put(`/api/doc-gestion/${id}`, data);
  return response.data;
}

// 🔒 Eliminar categoría
export async function deleteDocGestionCategoria(id) {
  await getCsrfToken();
  const response = await api.delete(`/api/doc-gestion/${id}`);
  return response.data;
}

// 🔒 Obtener ítems de una categoría específica
export async function getDocGestionItemsByCategoria(categoryId) {
  await getCsrfToken();
  const response = await api.get(`/api/doc-gestion-items/categoria/${categoryId}`);
  return response.data;
}

// 🔒 Crear nuevo ítem (con posible archivo PDF)
export async function createDocGestionItem(data) {
  await getCsrfToken();
  const formData = new FormData();
  formData.append('doc_gestion_category_id', data.doc_gestion_category_id);
  formData.append('question', data.question);
  formData.append('answer', data.answer);
  if (data.file) {
    formData.append('file', data.file); // ⬅️ clave del input tipo file
  }

  const response = await api.post('/api/doc-gestion-items', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// 🔒 Actualizar ítem (con posible reemplazo de archivo)
export async function updateDocGestionItem(id, data) {
  await getCsrfToken();
  const formData = new FormData();
  formData.append('question', data.question);
  formData.append('answer', data.answer);
  if (data.file) {
    formData.append('file', data.file); // ⬅️ si se reemplaza el archivo
  }

  const response = await api.post(`/api/doc-gestion-items/${id}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

// 🔒 Eliminar ítem
export async function deleteDocGestionItem(id) {
  await getCsrfToken();
  const response = await api.delete(`/api/doc-gestion-items/${id}`);
  return response.data;
}
