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
  ssr: false,

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
        { name: 'description', content: 'TOON Viewer - Edit and preview TOON files with Monaco Editor' },
        { name: 'theme-color', content: '#000000' }
      ]
    }
  },

  // === Styling ===
  css: ['~/assets/css/main.css'],

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
      crawlLinks: false,
      routes: ['/']
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

  // === Internationalization ===
  // @nuxtjs/i18n v10+: lazy loading is automatic when `file` is specified
  // restructureDir defaults to 'i18n', langDir is relative to it
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' }
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix'
  }
})
