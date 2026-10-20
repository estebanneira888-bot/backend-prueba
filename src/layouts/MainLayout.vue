<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const drawer = ref(true);

const iniciales = computed(() => {
  const nombre = auth.usuario?.nombre?.trim();
  if (!nombre) return "US";
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
});

const salir = () => {
  auth.logout();
  router.push({ name: "login" }).catch(() => {});
};
</script>

<template>
  <q-layout view="hHh Lpr fFf">
    <q-header class="app-header" height-hint="70">
      <q-toolbar class="q-py-sm">
        <q-btn flat dense round icon="menu" color="primary" @click="drawer = !drawer" />
        <div class="q-ml-sm">
          <q-toolbar-title class="text-grey-9">Panel Académico</q-toolbar-title>
          <div class="header-sub">Gestión de cursos y aprendices</div>
        </div>
        <q-space />
        <q-btn flat round icon="logout" color="grey-7" class="gt-xs" @click="salir">
          <q-tooltip>Cerrar sesión</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" show-if-above :width="266" class="sidebar">
      <div class="column fit">
        <div class="brand-block">
          <div class="brand-badge"><q-icon name="school" size="24px" /></div>
          <div>
            <div class="brand-name">EduGestión</div>
            <div class="brand-sub">Panel académico</div>
          </div>
        </div>

        <q-list class="q-mt-sm">
          <q-item-label class="sidebar-label">Módulos</q-item-label>

          <q-item clickable v-ripple :to="{ name: 'panel' }" exact class="nav-item" active-class="nav-item-active">
            <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
            <q-item-section>Panel</q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'cursos' }" class="nav-item" active-class="nav-item-active">
            <q-item-section avatar><q-icon name="menu_book" /></q-item-section>
            <q-item-section>Cursos</q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'aprendices' }" class="nav-item" active-class="nav-item-active">
            <q-item-section avatar><q-icon name="school" /></q-item-section>
            <q-item-section>Aprendices</q-item-section>
          </q-item>

          <q-item clickable v-ripple :to="{ name: 'usuarios' }" class="nav-item" active-class="nav-item-active">
            <q-item-section avatar><q-icon name="manage_accounts" /></q-item-section>
            <q-item-section>Registrar usuario</q-item-section>
          </q-item>
        </q-list>

        <q-space />

        <div class="sidebar-user">
          <div class="user-avatar">{{ iniciales }}</div>
          <div class="col overflow-hidden">
            <div class="text-white text-weight-bold ellipsis" style="font-size: 13px">
              {{ auth.usuario?.nombre || "Usuario" }}
            </div>
            <div class="ellipsis" style="color: #8fa3c8; font-size: 11px">
              {{ auth.usuario?.email || "Sesión activa" }}
            </div>
          </div>
          <q-btn flat round dense icon="logout" color="grey-4" @click="salir">
            <q-tooltip>Cerrar sesión</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="page-bg app-page">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
