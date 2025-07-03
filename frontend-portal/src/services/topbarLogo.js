// src/services/topbarLogo.js
import api from '@/lib/axios';

// Obtener el token CSRF para formularios protegidos
export async function getCsrfToken() {
  await api.get('/sanctum/csrf-cookie');
}

// Listar todos los logos del topbar (requiere autenticación)
export async function getTopbarLogos() {
  const response = await api.get('/api/topbar-logos');
  return response.data;
}

// Crear nuevo logo (requiere autenticación y CSRF)
export async function createTopbarLogo(formData) {
  await getCsrfToken();
  const response = await api.post('/api/topbar-logos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Actualizar un logo (activar/desactivar o nuevo archivo)
export async function updateTopbarLogo(id, formData) {
  await getCsrfToken();
  const response = await api.post(`/api/topbar-logos/${id}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

// Eliminar un logo
export async function deleteTopbarLogo(id) {
  await getCsrfToken();
  const response = await api.delete(`/api/topbar-logos/${id}`);
  return response.data;
}

// ✅ Esta es la función que te falta: obtener el logo activo (público)
export async function getTopbarLogoPublic() {
  const response = await api.get('/api/topbar-logo'); // ← esta ruta pública
  return response.data;
}
