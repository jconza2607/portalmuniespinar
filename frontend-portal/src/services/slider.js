import api from '@/lib/axios';

// ──────────────── 🟢 Rutas públicas ────────────────

// Obtener sliders activos para frontend público
export async function getSlidersPublic() {
  const response = await api.get('/api/sliders-publico');
  return response.data;
}

// Obtener un slider público por ID
export async function getSliderPublic(id) {
  const response = await api.get(`/api/sliders-publico/${id}`);
  return response.data;
}

// ──────────────── 🔒 Rutas privadas (admin) ────────────────

// Obtener todos los sliders (admin)
export async function getSliders() {
  const response = await api.get('/api/sliders');
  return response.data;
}

// Obtener un slider por ID (admin)
export async function getSlider(id) {
  const response = await api.get(`/api/sliders/${id}`);
  return response.data;
}

// Crear nuevo slider
export async function createSlider(data) {
  await api.post('/api/sliders', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// Actualizar slider existente
export async function updateSlider(id, data) {
  await api.post(`/api/sliders/${id}?_method=PUT`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// Eliminar slider
export async function deleteSlider(id) {
  await api.delete(`/api/sliders/${id}`);
}
