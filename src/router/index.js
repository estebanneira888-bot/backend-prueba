import { createRouter, createWebHashHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

const routes = [
  { path: "/login", name: "login", component: () => import("../pages/LoginPage.vue"), meta: { publica: true } },
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    redirect: "/panel",
    children: [
      { path: "panel", name: "panel", component: () => import("../pages/DashboardPage.vue") },
      { path: "cursos", name: "cursos", component: () => import("../pages/CursosPage.vue") },
      { path: "aprendices", name: "aprendices", component: () => import("../pages/AprendicesPage.vue") },
      { path: "usuarios", name: "usuarios", component: () => import("../pages/UsuariosPage.vue") },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/panel" },
];

// Hash mode: el backend sirve el build desde /public y asi las URLs directas funcionan.
const router = createRouter({ history: createWebHashHistory(), routes });

router.beforeEach((to) => {
  const auth = useAuthStore();
  const esPublica = to.matched.some((r) => r.meta.publica);
  if (!esPublica && !auth.isAuth) return { name: "login" };
  if (to.name === "login" && auth.isAuth) return { name: "panel" };
});

export default router;
