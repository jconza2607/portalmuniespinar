import api from '@/lib/axios';

// Obtener el token CSRF para acciones protegidas
export async function getCsrfToken() {
  await api.get('/sanctum/csrf-cookie');
}

// 🟢 Listar organigrama público (solo nodos activos)
export async function fetchOrganigrama() {
  const response = await api.get('/api/organigrama');
  return response.data;
}

// 🔒 Listar todo el organigrama (admin)
export async function getOrganigramas() {
  const response = await api.get('/api/organigramas');
  return response.data;
}

// 🔒 Ver un nodo individual
export async function getOrganigrama(id) {
  const response = await api.get(`/api/organigramas/${id}`);
  return response.data;
}

// 🔒 Crear nuevo nodo
export async function createOrganigrama(data) {
  await getCsrfToken();
  const response = await api.post('/api/organigramas', data);
  return response.data;
}

// 🔒 Actualizar nodo existente
export async function updateOrganigrama(id, data) {
  await getCsrfToken();
  const response = await api.put(`/api/organigramas/${id}`, data);
  return response.data;
}

// 🔒 Eliminar nodo
export async function deleteOrganigrama(id) {
  await getCsrfToken();
  const response = await api.delete(`/api/organigramas/${id}`);
  return response.data;
}
