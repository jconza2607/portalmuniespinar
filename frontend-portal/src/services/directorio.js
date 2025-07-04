// src/services/directorio.js
import api from '@/lib/axios';

// 🛡 Obtener el token CSRF (requerido por Sanctum)
export async function getCsrfToken() {
  await api.get('/sanctum/csrf-cookie');
}

// 🟢 Obtener el directorio público (página abierta)
export async function getDirectoriosPublic() {
  const { data } = await api.get('/api/directorio', {
    params: { per_page: 1000 }, // asumes que no hay más de 1000
  });
  return data.data;
}

// 🔒 Listar todo el directorio (admin)
export async function getDirectorios(page = 1, perPage = 5) {
  const { data } = await api.get('/api/directorio', {
    params: { page, per_page: perPage },
  });
  return data; // ✅ incluye: data, current_page, last_page, etc.
}

// 🔒 Mostrar un director (admin)
export async function getDirectorio(id) {
  const response = await api.get(`/api/directorios/${id}`);
  return response.data;
}

// 🔒 Crear nuevo miembro del directorio
export async function createDirectorio(data) {
  await getCsrfToken();
  const response = await api.post('/api/directorios', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// 🔒 Actualizar miembro del directorio
export async function updateDirectorio(id, data) {
  await getCsrfToken();
  const response = await api.post(`/api/directorios/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// 🔒 Eliminar miembro del directorio
export async function deleteDirectorio(id) {
  await getCsrfToken();
  const response = await api.delete(`/api/directorios/${id}`);
  return response.data;
}
