import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Rutas relativas: funciona en la raíz de un dominio o en una subcarpeta (GitHub Pages)
  base: './',
  // Lo de React se prepara al arrancar el servidor de desarrollo (no cambia la versión publicada)
  optimizeDeps: { include: ['react', 'react-dom/client', '@mui/material', '@mui/material/styles', '@emotion/react', '@emotion/styled'] },
  build: {
    rollupOptions: {
      output: {
        // Los textos de cursos y libros (más de la mitad del peso) van en archivos aparte: al publicar un cambio
        // de la app, el celular no los vuelve a descargar. Siguen guardados al instalar, así que todo funciona sin señal
        manualChunks(id) {
          const ruta = id.replace(/\\/g, '/');
          if (ruta.includes('/src/cursos/')) return 'cursos';
          if (ruta.includes('/src/libros/')) return 'libros';
        },
      },
    },
  },
  // 🎙️ Audio a texto: el trabajador de Whisper (src/voz-trabajador.js) es un módulo (baja la librería con import())
  worker: { format: 'es' },
  plugins: [
    // Solo para las pantallas migradas a React (src/react)
    react({ include: /src[\\/]react[\\/].*\.[jt]sx?$/ }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Rutina diaria',
        short_name: 'Rutina',
        description: 'Mañana, metas del día, gym y sesiones guiadas.',
        lang: 'es',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#101418',
        background_color: '#101418',
        icons: [
          { src: 'icons/icono-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icono-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icono-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Todo queda guardado al instalar: la app funciona completa sin señal en el gym
        globPatterns: ['**/*.{html,js,css,png,svg,webp,woff2}'],
        navigateFallback: null,
        // 🎙️ La librería de Whisper (transformers.js y su motor wasm, de jsDelivr con versión fija) queda guardada la
        // primera vez que se usa, para pasar audios a texto sin señal. El modelo lo guarda la librería en su propia caché
        runtimeCaching: [{
          urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/(@huggingface\/transformers|onnxruntime-web)@/,
          handler: 'CacheFirst',
          options: { cacheName: 'voz-libreria', expiration: { maxEntries: 30 }, cacheableResponse: { statuses: [0, 200] } },
        }],
      },
    }),
  ],
});
