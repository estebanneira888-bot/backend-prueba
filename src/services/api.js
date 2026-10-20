import axios from "axios";
import { useAuthStore } from "../stores/auth";
import router from "../router";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:4500/api").replace(/\/$/, ""),
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Inyecta el token en la cabecera x-token que espera el backend.
api.interceptors.request.use(
  (config) => {
    const auth = useAuthStore();
    if (auth.token) config.headers["x-token"] = auth.token;
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 = token faltante, vencido o alterado: cerrar sesion y volver al login.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const auth = useAuthStore();
    if (error.response?.status === 401 && auth.token) {
      auth.logout();
      if (router.currentRoute.value.name !== "login") {
        router.push({ name: "login" }).catch(() => {});
      }
    }
    return Promise.reject(error);
  }
);

// Convierte cualquier error del backend en un texto legible.
export const mensajeError = (e) => {
  if (!e.response) {
    return "No se pudo conectar con el servidor. Verifica que el backend esté corriendo y que la URL de la API sea correcta.";
  }
  const errs = e.response?.data?.errors;
  if (Array.isArray(errs)) return errs.join(". ");
  if (typeof errs === "string") return errs;
  return e.response?.data?.msg || "Ocurrió un error inesperado en el servidor";
};

export default api;
