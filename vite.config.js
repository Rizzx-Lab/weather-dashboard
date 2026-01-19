import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// SEMENTARA disable PWA plugin untuk hindari error
export default defineConfig({
  plugins: [
    react()
    // VitePWA plugin DISABLED sementara
    // VitePWA({ ... })
  ],
  server: {
    port: 5173,
    host: true
  }
})