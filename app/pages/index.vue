<script setup lang="ts">
const { t } = useI18n()
const toonStore = useToonStore()

// Keyboard shortcuts
const keys = useMagicKeys()
const ctrlZ = computed(() => keys['Ctrl+z']?.value ?? false)
const ctrlY = computed(() => keys['Ctrl+y']?.value ?? false)
const ctrlShiftF = computed(() => keys['Ctrl+Shift+f']?.value ?? false)

watch(ctrlZ, (pressed) => {
  if (pressed) toonStore.undo()
})

watch(ctrlY, (pressed) => {
  if (pressed) toonStore.redo()
})

watch(ctrlShiftF, (pressed) => {
  if (pressed) toonStore.format()
})

function handleContentUpdate(content: string) {
  toonStore.setContent(content)
}
</script>

<template>
  <UDashboardPanel id="toon-viewer" class="flex flex-col h-screen">
    <template #header>
      <UDashboardNavbar :title="t('app.title')" :ui="{ right: 'gap-3' }">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <ToonBatchEdit />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar class="px-4 py-2">
        <ToonToolbar />
      </UDashboardToolbar>
    </template>

    <template #body>
      <div class="flex flex-col lg:flex-row h-full overflow-hidden">
        <!-- Left: Explorer -->
        <div class="w-full lg:w-72 border-r border-default shrink-0 overflow-hidden flex flex-col">
          <ToonExplorer />
        </div>

        <!-- Center: Monaco Editor -->
        <div class="flex-1 min-w-0 p-2">
          <ClientOnly>
            <ToonEditor
              :model-value="toonStore.rawContent"
              @update:model-value="handleContentUpdate"
            />
            <template #fallback>
              <div class="h-[500px] flex items-center justify-center bg-gray-800">
                <UIcon name="i-lucide-loader-2" class="w-8 h-8 animate-spin text-primary" />
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
