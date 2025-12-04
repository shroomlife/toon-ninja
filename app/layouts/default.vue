<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const { t } = useI18n()

const open = ref(false)
const settingsOpen = ref(false)
const shortcutsOpen = ref(false)

const links = computed<NavigationMenuItem[][]>(() => [[{
  label: t('nav.viewer'),
  icon: 'i-lucide-eye',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}], [{
  label: t('settings.title'),
  icon: 'i-lucide-settings',
  onSelect: () => {
    settingsOpen.value = true
    open.value = false
  }
}, {
  label: t('shortcuts.title'),
  icon: 'i-lucide-keyboard',
  onSelect: () => {
    shortcutsOpen.value = true
    open.value = false
  }
}]])
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center gap-2 px-2 py-1">
          <UIcon name="i-lucide-file-json" class="w-6 h-6 text-primary" />
          <span v-if="!collapsed" class="font-semibold">TOON Viewer</span>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
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
        <ToonShortcuts />
      </template>
    </UModal>
  </UDashboardGroup>
</template>
