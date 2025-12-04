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
        { rel: 'canonical', href: 'https://toon.ninja' },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        }
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
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'hi', name: 'हिन्दी', file: 'hi.json' },
      { code: 'ja', name: '日本語', file: 'ja.json' },
      { code: 'ko', name: '한국어', file: 'ko.json' },
      { code: 'pl', name: 'Polski', file: 'pl.json' },
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'ru', name: 'Русский', file: 'ru.json' },
      { code: 'vi', name: 'Tiếng Việt', file: 'vi.json' },
      { code: 'zh', name: '中文', file: 'zh.json' }
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'app/i18n',
      fallbackLocale: 'en'
    },
    langDir: 'locales'
  }
})
