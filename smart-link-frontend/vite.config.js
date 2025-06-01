import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()],

  server: {
    allowedHosts: [
      'TRUE',
      'qr-gen-2.vercel.app',
      'qr-gen-2-dmlu.onrender.com'
      // you can also add other hosts or 'all' to allow everything (less secure)
      // or use '*' to allow all (for dev only)
    ],
  },
})
