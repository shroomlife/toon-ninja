<script setup lang="ts">
const { t } = useI18n()
const toonStore = useToonStore()

// SEO Meta Tags - static values for SSR hydration compatibility
useSeoMeta({
  title: 'TOON NINJA - Free Online TOON Editor & JSON Converter',
  description: 'TOON NINJA is a free online editor for TOON format. Convert JSON to TOON, reduce LLM token costs by 30-60%, validate and format with live preview.',
  ogTitle: 'TOON NINJA - Free Online TOON Editor & JSON Converter',
  ogDescription: 'TOON NINJA is a free online editor for TOON format. Convert JSON to TOON, reduce LLM token costs by 30-60%, validate and format with live preview.',
  ogType: 'website',
  ogSiteName: 'TOON NINJA',
  ogUrl: 'https://toon.ninja',
  twitterCard: 'summary_large_image',
  twitterTitle: 'TOON NINJA - Free Online TOON Editor & JSON Converter',
  twitterDescription: 'TOON NINJA is a free online editor for TOON format. Convert JSON to TOON, reduce LLM token costs by 30-60%, validate and format with live preview.',
})

// Schema.org JSON-LD
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'TOON NINJA',
      'description': 'Free online editor for TOON format. Convert JSON to TOON, reduce LLM token costs by 30-60%, validate and format with live preview.',
      'applicationCategory': 'DeveloperApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD',
      },
      'url': 'https://toon.ninja',
      'author': {
        '@type': 'Organization',
        'name': 'TOON NINJA',
      },
    }),
  }],
})

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
      <UDashboardNavbar :title="t('nav.viewer')" :ui="{ right: 'gap-3' }">
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
        <div class="w-full lg:w-96 border-r border-default shrink-0 overflow-hidden flex flex-col">
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
