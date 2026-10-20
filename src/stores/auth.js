import { defineStore } from "pinia";
import { usuariosService } from "../services/usuarios.service";

export const useAuthStore = defineStore("auth", {
  state: () => ({ token: "", usuario: null }),
  getters: {
    isAuth: (s) => !!s.token,
  },
  actions: {
    async login(credenciales) {
      const { data } = await usuariosService.login(credenciales);
      this.token = data.token;
      this.usuario = data.usuario;
    },
    logout() {
      this.token = "";
      this.usuario = null;
    },
  },
  persist: true, // guarda token y usuario en localStorage
});
