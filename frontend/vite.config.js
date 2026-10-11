import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Forward same-origin /api/* requests to the Express backend.
      // This avoids CORS issues in the browser for both dev and static builds.
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
})