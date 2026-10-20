import api from "./api";

export const usuariosService = {
  login: (data) => api.post("/usuarios/login", data),
  crear: (data) => api.post("/usuarios/register", data),
};
