import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '4173-f9w4pzo0m0bcgn2da2asm75kmncx8pmo6mbtmk7clnh7g2ivtg4.tunnel.runloop.ai',
    ],
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  preview: {
    allowedHosts: [
      '4173-f9w4pzo0m0bcgn2da2asm75kmncx8pmo6mbtmk7clnh7g2ivtg4.tunnel.runloop.ai',
    ],
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
