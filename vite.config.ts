import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  // The sandboxed dev preview serves this app under /swat-inbox/, but a standalone
  // production build (e.g. deployed to Netlify) is hosted at its own domain root.
  base: command === 'build' ? '/' : '/swat-inbox/',
}))
