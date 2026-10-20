# frontend-prueba

Vue 3 + Quasar + Pinia (+ persistedstate) + vue-router + axios.

    npm install
    npm run dev        # http://localhost:5173

Backend en http://localhost:4500 (cambia `VITE_API_URL` en `.env`; reinicia `npm run dev` al editarlo).
Usuario de prueba (tras `npm run seed` en el backend): admin@sena.edu.co / 123456

Para servirlo desde el backend: `npm run build` y copia el contenido de `dist/` a `backend/public/`.
