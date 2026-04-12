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
      workbox: {
        clientsClaim: true,   // 🔥 TAKE CONTROL IMMEDIATELY
        skipWaiting: true,    // 🔥 ACTIVATE NEW SW IMMEDIATELY
        runtimeCaching: [
          {
            // Match API routes
            urlPattern: ({ url }) => {
              return (
                url.pathname.startsWith('/api') &&
                !url.pathname.includes('/mercadopago')
              );
            },
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60 // 24 hours
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache images using CacheFirst
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 1 week
              }
            }
          }
        ]
      },
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