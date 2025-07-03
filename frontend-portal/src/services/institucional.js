import api from '@/lib/axios';

// 🛡 Obtener el token CSRF (requerido por Sanctum en POST, PUT, DELETE)
export async function getCsrfToken() {
  await api.get('/sanctum/csrf-cookie');
}

// 🟢 Mostrar la versión institucional activa (público)
export async function getInstitucionalPublic() {
  const response = await api.get('/api/institucional');
  return response.data;
}

// 🔒 Listar todas las versiones (requiere autenticación)
export async function getInstitucionales() {
  const response = await api.get('/api/institucionales');
  return response.data;
}

// 🔒 Crear una nueva versión
export async function createInstitucional(data) {
  await getCsrfToken();
  const response = await api.post('/api/institucionales', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// 🔒 Actualizar una versión existente
export async function updateInstitucional(id, data) {
  await getCsrfToken();
  const response = await api.post(`/api/institucionales/${id}?_method=PUT`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

// 🔒 Activar una versión
export async function activarInstitucional(id) {
  await getCsrfToken();
  const response = await api.post(`/api/institucionales/${id}/activar`);
  return response.data;
}

// 🔒 Eliminar una versión
export async function deleteInstitucional(id) {
  await getCsrfToken();
  const response = await api.delete(`/api/institucionales/${id}`);
  return response.data;
}
