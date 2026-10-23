import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Rutas relativas: funciona en la raíz de un dominio o en una subcarpeta (GitHub Pages)
  base: './',
  plugins: [
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
        globPatterns: ['**/*.{html,js,css,png,svg}'],
        navigateFallback: null,
      },
    }),
  ],
});
