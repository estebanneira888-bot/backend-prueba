import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { quasar } from "@quasar/vite-plugin";

export default defineConfig({
  plugins: [vue(), quasar()],
  server: {
    port: 5180,
    strictPort: true,
    proxy: { "/api": "http://localhost:4500" },
  },
});
