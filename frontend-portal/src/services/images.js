import api from '@/lib/axios';

// 🟢 Pública: obtener imagen por sección
export async function getSectionImage(section) {
  const response = await api.get(`/api/secciones/${section}`);
  return response.data;
}

// 🔒 Admin: obtener todas las imágenes
export async function getAllSectionImages() {
  const response = await api.get('/api/secciones');
  return response.data;
}

// 🔒 Admin: crear imagen por sección
export async function createSectionImage(data) {
  await api.post('/api/secciones', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// 🔒 Admin: actualizar imagen
export async function updateSectionImage(id, data) {
  await api.post(`/api/secciones/${id}?_method=PUT`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// 🔒 Admin: eliminar imagen
export async function deleteSectionImage(id) {
  await api.delete(`/api/secciones/${id}`);
}
