import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['e65e-2409-4080-860a-a2f7-9528-f30a-86f6-33ab.ngrok-free.app']

  }
})
