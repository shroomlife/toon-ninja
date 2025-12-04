import { createSharedComposable } from '@vueuse/core'

const _useDashboard = () => {
  const route = useRoute()
  const router = useRouter()
  const isSettingsOpen = ref(false)
  const isShortcutsOpen = ref(false)

  defineShortcuts({
    'g-h': () => router.push('/'),
    'g-c': () => router.push('/compare'),
    '?': () => isShortcutsOpen.value = !isShortcutsOpen.value
  })

  watch(() => route.fullPath, () => {
    isSettingsOpen.value = false
    isShortcutsOpen.value = false
  })

  return {
    isSettingsOpen,
    isShortcutsOpen
  }
}

export const useDashboard = createSharedComposable(_useDashboard)
