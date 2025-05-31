import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()],
  server: {
    allowedHosts: [
      'all',
      '18fe-2a02-a58-9101-4f00-c9b7-433f-e691-865a.ngrok-free.app'
      // you can also add other hosts or 'all' to allow everything (less secure)
      // or use '*' to allow all (for dev only)
    ],
  },
})
