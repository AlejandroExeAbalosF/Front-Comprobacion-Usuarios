import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  build: {
    terserOptions: {
      format: {
        comments: false, // Elimina comentarios en archivos minificados
      },
    },
  },
})
