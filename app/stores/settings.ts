import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    fontSize: 14,
    wordWrap: true,
    autoSave: false,
    autoSaveInterval: 30000, // 30 seconds
    showLineNumbers: true,
    showMinimap: false,
    tabSize: 2
  }),

  actions: {
    setFontSize(size: number) {
      this.fontSize = Math.max(10, Math.min(24, size))
    },

    toggleWordWrap() {
      this.wordWrap = !this.wordWrap
    },

    toggleAutoSave() {
      this.autoSave = !this.autoSave
    },

    toggleLineNumbers() {
      this.showLineNumbers = !this.showLineNumbers
    },

    toggleMinimap() {
      this.showMinimap = !this.showMinimap
    },

    setTabSize(size: number) {
      this.tabSize = Math.max(2, Math.min(8, size))
    }
  },

  persist: true
})
