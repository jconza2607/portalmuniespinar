// services/menu.js
import api from "@/lib/axios";
import { getCsrfToken } from "./auth";

/* ---------- LISTAR (público) ---------- */
export async function fetchMenu() {
  const response = await api.get("/api/menu");
  return response.data;
}

/* ---------- CREAR ---------- */
export async function createMenu(data) {
  await getCsrfToken();
  const response = await api.post("/api/menu", data);
  return response.data;
}

/* ---------- ACTUALIZAR ---------- */
export async function updateMenu(id, data) {
  await getCsrfToken();
  const response = await api.put(`/api/menu/${id}`, data);
  return response.data;
}

/* ---------- ELIMINAR ---------- */
export async function deleteMenu(id) {
  await getCsrfToken();
  const response = await api.delete(`/api/menu/${id}`);
  return response.data;
}
