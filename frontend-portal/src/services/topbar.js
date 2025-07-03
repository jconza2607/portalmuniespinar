// src/services/topbar.js
import api from '@/lib/axios';

// Obtener el token CSRF
export async function getCsrfToken() {
  await api.get('/sanctum/csrf-cookie');
}

// Listar todos los topbars (público o protegido)
export async function getTopbars() {
  const response = await api.get('/api/topbars');
  return response.data;
}

// Crear un nuevo topbar (requiere CSRF)
export async function createTopbar(data) {
  await getCsrfToken();
  const response = await api.post('/api/topbars', data);
  return response.data;
}

// Actualizar un topbar existente
export async function updateTopbar(id, data) {
  await getCsrfToken();
  const response = await api.put(`/api/topbars/${id}`, data);
  return response.data;
}

// Eliminar un topbar
export async function deleteTopbar(id) {
  await getCsrfToken();
  const response = await api.delete(`/api/topbars/${id}`);
  return response.data;
}

// Mostrar topbar público (correo habilitado)
export async function getTopbarPublic() {
  const response = await api.get('/api/topbar');
  return response.data;
}