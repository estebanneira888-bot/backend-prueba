import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { Quasar, Notify, Dialog } from "quasar";
import quasarLang from "quasar/lang/es";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/dist/quasar.css";
import "./css/styles.css";

import App from "./App.vue";
import router from "./router";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // persiste los stores que tengan persist: true

createApp(App)
  .use(pinia)
  .use(router)
  .use(Quasar, {
    plugins: { Notify, Dialog },
    lang: quasarLang,
    config: {
      brand: {
        primary: "#4f46e5",
        secondary: "#0f172a",
        accent: "#ea580c",
        dark: "#0b1220",
        positive: "#10b981",
        negative: "#ef4444",
        info: "#0ea5e9",
        warning: "#f59e0b",
      },
      notify: { position: "bottom-right", timeout: 3200 },
    },
  })
  .mount("#app");
