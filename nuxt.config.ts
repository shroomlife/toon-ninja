// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  // === SPA Mode Configuration ===
  ssr: true,

  // === Development Tools ===
  devtools: {
    enabled: true
  },

  // === App Configuration ===
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'theme-color', content: '#000000' }
      ],
      link: [
        { rel: 'canonical', href: 'https://toon.ninja' }
      ]
    }
  },

  // === Styling ===
  css: ['~/assets/css/main.css'],

  // === Site URL for Sitemap & SEO ===
  site: {
    url: 'https://toon.ninja'
  },

  // === Runtime Config ===
  runtimeConfig: {
    public: {
      appName: 'TOON Viewer',
      appVersion: '1.0.0'
    }
  },

  // === Build Optimization ===
  build: {
    transpile: ['monaco-editor']
  },

  // === Compatibility ===
  compatibilityDate: '2024-12-04',
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/about', '/convert', '/token-optimization', '/features', '/compare']
    }
  },

  // === Vite Configuration ===
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            monaco: ['monaco-editor']
          }
        }
      }
    }
  },

  // === ESLint Configuration ===
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  i18n: {
    defaultLocale: 'de',
    locales: [
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'en', name: 'English', file: 'en.json' }
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'app/i18n',
      fallbackLocale: 'de'
    },
    langDir: 'locales'
  }
})
