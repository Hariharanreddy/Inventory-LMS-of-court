import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// http://192.168.29.135:8000
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:8000"
    }
  },
  plugins: [react()]
})
