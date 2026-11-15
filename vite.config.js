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
        globPatterns: ['**/*.{html,js,css,png,svg,webp}'],
        navigateFallback: null,
      },
    }),
  ],
});
