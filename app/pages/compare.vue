<script setup lang="ts">
const { t } = useI18n()

// SEO Meta Tags - static values for SSR hydration compatibility
useSeoMeta({
  title: 'TOON vs JSON - Format Comparison for AI Applications',
  description: 'TOON vs JSON compared: token efficiency, readability, use cases. See why TOON saves 30-60% tokens for LLM applications while staying JSON-compatible.',
  ogTitle: 'TOON vs JSON - Format Comparison for AI Applications',
  ogDescription: 'TOON vs JSON compared: token efficiency, readability, use cases. See why TOON saves 30-60% tokens for LLM applications while staying JSON-compatible.',
  ogType: 'website',
  ogSiteName: 'TOON NINJA',
  ogUrl: 'https://toon.ninja/compare',
  twitterCard: 'summary_large_image',
  twitterTitle: 'TOON vs JSON - Format Comparison for AI Applications',
  twitterDescription: 'TOON vs JSON compared: token efficiency, readability, use cases. See why TOON saves 30-60% tokens for LLM applications while staying JSON-compatible.'
})

const comparisonRows = computed(() => [
  {
    criterion: t('pages.compare.table.tokenEfficiency'),
    toon: t('pages.compare.table.tokenToon'),
    json: t('pages.compare.table.tokenJson'),
    toonWins: true
  },
  {
    criterion: t('pages.compare.table.readability'),
    toon: t('pages.compare.table.readabilityToon'),
    json: t('pages.compare.table.readabilityJson'),
    toonWins: true
  },
  {
    criterion: t('pages.compare.table.ecosystem'),
    toon: t('pages.compare.table.ecosystemToon'),
    json: t('pages.compare.table.ecosystemJson'),
    toonWins: false
  },
  {
    criterion: t('pages.compare.table.learningCurve'),
    toon: t('pages.compare.table.learningToon'),
    json: t('pages.compare.table.learningJson'),
    toonWins: null
  },
  {
    criterion: t('pages.compare.table.bestFor'),
    toon: t('pages.compare.table.bestForToon'),
    json: t('pages.compare.table.bestForJson'),
    toonWins: null
  }
])
</script>

<template>
  <UDashboardPanel id="compare">
    <template #header>
      <UDashboardNavbar :title="t('nav.compare')" />
    </template>

    <template #body>
      <div class="overflow-y-auto h-full">
        <div class="max-w-5xl mx-auto p-6 pb-24">
          <!-- Hero Section -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <UIcon name="i-lucide-scale" class="w-10 h-10 text-primary" />
            </div>
            <h1 class="text-4xl font-bold mb-4">
              {{ t('pages.compare.hero.title') }}
            </h1>
            <p class="text-lg text-muted max-w-2xl mx-auto">
              {{ t('pages.compare.hero.subtitle') }}
            </p>
          </div>

          <!-- Comparison Table -->
          <UCard class="mb-12">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-default">
                    <th class="text-left py-3 px-4 font-semibold">
                      {{ t('pages.compare.table.criterion') }}
                    </th>
                    <th class="text-left py-3 px-4 font-semibold">
                      <UBadge color="primary" variant="solid">
                        {{ t('pages.compare.table.toon') }}
                      </UBadge>
                    </th>
                    <th class="text-left py-3 px-4 font-semibold">
                      <UBadge color="neutral" variant="soft">
                        {{ t('pages.compare.table.json') }}
                      </UBadge>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="row in comparisonRows"
                    :key="row.criterion"
                    class="border-b border-default last:border-0"
                  >
                    <td class="py-3 px-4 font-medium">
                      {{ row.criterion }}
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <UIcon
                          v-if="row.toonWins === true"
                          name="i-lucide-check-circle"
                          class="w-4 h-4 text-success shrink-0"
                        />
                        <span :class="{ 'text-success font-medium': row.toonWins === true }">
                          {{ row.toon }}
                        </span>
                      </div>
                    </td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <UIcon
                          v-if="row.toonWins === false"
                          name="i-lucide-check-circle"
                          class="w-4 h-4 text-success shrink-0"
                        />
                        <span :class="{ 'text-success font-medium': row.toonWins === false }">
                          {{ row.json }}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </UCard>

          <!-- When to Use Sections -->
          <div class="grid md:grid-cols-2 gap-6 mb-12">
            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-5 h-5 text-success" />
                  <h2 class="text-lg font-semibold">
                    {{ t('pages.compare.whenToon.title') }}
                  </h2>
                </div>
              </template>

              <p class="text-muted">
                {{ t('pages.compare.whenToon.description') }}
              </p>
            </UCard>

            <UCard>
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="w-5 h-5 text-primary" />
                  <h2 class="text-lg font-semibold">
                    {{ t('pages.compare.whenJson.title') }}
                  </h2>
                </div>
              </template>

              <p class="text-muted">
                {{ t('pages.compare.whenJson.description') }}
              </p>
            </UCard>
          </div>

          <!-- CTA -->
          <div class="text-center">
            <UCard class="bg-primary/5 border-primary/20">
              <div class="py-4">
                <UButton to="/" icon="i-lucide-play" size="lg">
                  {{ t('pages.compare.cta') }}
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
