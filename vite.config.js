import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Arroyo Seco',
        short_name: 'ArroyoSeco',
        description: 'Arroyo Seco Frontend',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
  {
    src: 'images/pwa-192x192.png',
    sizes: '192x192',
    type: 'image/png'
  },
  {
    src: 'images/pwa-512x512.png',
    sizes: '512x512',
    type: 'image/png'
  }
]
      }
    })
  ],
})