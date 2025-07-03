// src/services/auth.js
import api from '@/lib/axios';

// Obtener el token CSRF
export async function getCsrfToken() {
  await api.get('/sanctum/csrf-cookie');
}

// Iniciar sesión
export async function login(email, password) {
  await getCsrfToken();
  const response = await api.post('/api/login', { email, password });
  return response.data;
}

// Cerrar sesión
export async function logout() {
  try {
    await api.post('/api/logout');
  } catch (error) {
    // Si la sesión está rota (ej. 401 o 419), igual invalidamos el contexto
    if (error.response?.status === 401 || error.response?.status === 419) {
      console.warn('Sesión expirada o inválida.');
    } else {
      throw error; // Propagar otros errores
    }
  }
}

// Registrar usuario
export async function register(name, email, password) {
  await getCsrfToken();
  await api.post('/api/register', {
    name,
    email,
    password,
    password_confirmation: password,
  });
}

// Obtener usuario autenticado
export async function getUser() {
  const response = await api.get('/api/user');
  return response.data;
}
