// Nuxt 4 configuration alignée avec TailwindCSS 4 (plugin Vite officiel)
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  srcDir: 'app',
  typescript: {
    strict: true
  },
  css: ['@/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()]
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000'
    }
  },
  nitro: {
    compatibilityDate: '2025-11-27'
  },
  app: {
    head: {
      title: 'PixelProwlers',
      htmlAttrs: { lang: 'fr' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'PixelProwlers — studio pluriactif' }
      ]
    }
  }
});
