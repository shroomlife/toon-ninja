<script setup lang="ts">
const { t } = useI18n()
const toonStore = useToonStore()

// Keyboard shortcuts
const { Ctrl_z, Ctrl_y, Ctrl_Shift_f } = useMagicKeys()

watch(Ctrl_z, (pressed) => {
  if (pressed) toonStore.undo()
})

watch(Ctrl_y, (pressed) => {
  if (pressed) toonStore.redo()
})

watch(Ctrl_Shift_f, (pressed) => {
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

        <!-- Center: Editor -->
        <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
          <!-- Dropzone when empty -->
          <div
            v-if="!toonStore.rawContent"
            class="flex-1 flex items-center justify-center p-8"
          >
            <div class="w-full max-w-md">
              <ToonDropZone />
            </div>
          </div>

          <!-- Editor when content exists -->
          <ClientOnly v-else>
            <ToonEditor
              :model-value="toonStore.rawContent"
              class="flex-1"
              @update:model-value="handleContentUpdate"
            />
          </ClientOnly>
        </div>

        <!-- Right: Preview -->
        <div class="w-full lg:w-80 border-l border-default shrink-0 overflow-hidden flex flex-col">
          <ToonPreview />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
