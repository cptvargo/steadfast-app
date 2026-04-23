import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['steadfast-logo.png', 'icon-192.png', 'icon-512.png'],
      manifest: false, // use our existing public/manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
    }),
  ],
  base: "./",
  server: {
    port: 5177,
  },
})
