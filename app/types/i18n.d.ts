/**
 * i18n Type Definitions
 * Extends the locale type to allow dynamic locale codes
 */

// Extract locale codes from nuxt.config.ts
export type LocaleCode = string

declare module '#i18n' {
  interface I18nConfig {
    locales: Array<{ code: string, name: string, file: string }>
  }
}

declare module 'vue-i18n' {
  interface ComposerCustom {
    setLocale: (locale: string) => Promise<void>
  }
}
