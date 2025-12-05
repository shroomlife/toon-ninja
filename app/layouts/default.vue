<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { t, locale, locales, setLocale } = useI18n()

const open = ref(false)
const settingsOpen = ref(false)
const shortcutsOpen = ref(false)

// Language options for selector with circle-flags icons
const languageOptions = computed(() =>
  locales.value.map((l) => {
    const code = typeof l === 'string' ? l : l.code
    return {
      label: typeof l === 'string' ? l : l.name || l.code,
      value: code,
      icon: `i-circle-flags-${code}`,
    }
  }),
)

const selectedLanguage = computed({
  get: () => locale.value,
  set: (val: string) => {
    setLocale(val)
  },
})

const links = computed<NavigationMenuItem[][]>(() => [[{
  label: t('nav.viewer'),
  icon: 'i-lucide-edit',
  to: '/',
  onSelect: () => {
    open.value = false
  },
}], [{
  label: t('nav.about'),
  icon: 'i-lucide-info',
  to: '/about',
  onSelect: () => {
    open.value = false
  },
}, {
  label: t('nav.convert'),
  icon: 'i-lucide-arrow-right-left',
  to: '/convert',
  onSelect: () => {
    open.value = false
  },
}, {
  label: t('nav.tokenOptimization'),
  icon: 'i-lucide-piggy-bank',
  to: '/token-optimization',
  onSelect: () => {
    open.value = false
  },
}, {
  label: t('nav.features'),
  icon: 'i-lucide-zap',
  to: '/features',
  onSelect: () => {
    open.value = false
  },
}, {
  label: t('nav.compare'),
  icon: 'i-lucide-scale',
  to: '/compare',
  onSelect: () => {
    open.value = false
  },
}], [{
  label: t('settings.title'),
  icon: 'i-lucide-settings',
  onSelect: () => {
    settingsOpen.value = true
    open.value = false
  },
}, {
  label: t('shortcuts.title'),
  icon: 'i-lucide-keyboard',
  onSelect: () => {
    shortcutsOpen.value = true
    open.value = false
  },
}]])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header>
        <NuxtLink to="/" class="flex items-center gap-2 px-2 py-1">
          <AppLogo :size="24" />
          <span class="font-bold">TOON Ninja</span>
        </NuxtLink>
      </template>

      <template #default>
        <UNavigationMenu
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <div class="mt-auto space-y-2">
          <!-- About & Landing Pages -->
          <UNavigationMenu
            :items="links[1]"
            orientation="vertical"
            tooltip
          />

          <USeparator />

          <!-- Language Selector -->
          <div class="px-2">
            <USelectMenu
              v-model="selectedLanguage"
              :items="languageOptions"
              value-key="value"
              class="w-full"
              size="sm"
            >
              <template #leading="{ modelValue }">
                <UIcon
                  :name="`i-circle-flags-${modelValue}`"
                  class="w-4 h-4"
                />
              </template>
            </USelectMenu>
          </div>

          <UNavigationMenu
            :items="links[2]"
            orientation="vertical"
            tooltip
          />
        </div>
      </template>
    </UDashboardSidebar>

    <slot />

    <!-- Settings Slideover -->
    <USlideover v-model:open="settingsOpen" side="right">
      <template #content>
        <ToonSettings />
      </template>
    </USlideover>

    <!-- Shortcuts Modal -->
    <UModal v-model:open="shortcutsOpen">
      <template #content>
        <ToonShortcuts @close="shortcutsOpen = false" />
      </template>
    </UModal>
  </UDashboardGroup>
</template>
