<script setup lang="ts">
import { useI18n } from '#imports'

const { t } = useI18n()

// SEO Meta Tags - static values for SSR hydration compatibility
useSeoMeta({
  title: 'About TOON Format - Token-Oriented Object Notation',
  description: 'Learn about TOON, a compact data format that saves 30-60% tokens compared to JSON. Perfect for LLM applications and AI prompts.',
  ogTitle: 'About TOON Format - Token-Oriented Object Notation',
  ogDescription: 'Learn about TOON, a compact data format that saves 30-60% tokens compared to JSON. Perfect for LLM applications and AI prompts.',
  ogType: 'website',
  ogSiteName: 'TOON NINJA',
  ogUrl: 'https://toon.ninja/about',
  twitterCard: 'summary_large_image',
  twitterTitle: 'About TOON Format - Token-Oriented Object Notation',
  twitterDescription: 'Learn about TOON, a compact data format that saves 30-60% tokens compared to JSON. Perfect for LLM applications and AI prompts.',
})

// TOON example code
const toonExample = `users[3]{name, age, active}:
  Alice, 30, true
  Bob, 25, false
  Carol, 28, true`

const jsonExample = `{
  "users": [
    { "name": "Alice", "age": 30, "active": true },
    { "name": "Bob", "age": 25, "active": false },
    { "name": "Carol", "age": 28, "active": true }
  ]
}`

const features = computed(() => [
  {
    icon: 'i-lucide-file-text',
    title: t('about.features.humanReadable.title'),
    description: t('about.features.humanReadable.description'),
  },
  {
    icon: 'i-lucide-minimize-2',
    title: t('about.features.compact.title'),
    description: t('about.features.compact.description'),
  },
  {
    icon: 'i-lucide-table',
    title: t('about.features.tabular.title'),
    description: t('about.features.tabular.description'),
  },
  {
    icon: 'i-lucide-zap',
    title: t('about.features.efficient.title'),
    description: t('about.features.efficient.description'),
  },
  {
    icon: 'i-lucide-check-circle',
    title: t('about.features.jsonCompatible.title'),
    description: t('about.features.jsonCompatible.description'),
  },
  {
    icon: 'i-lucide-brain',
    title: t('about.features.llmFriendly.title'),
    description: t('about.features.llmFriendly.description'),
  },
])

const useCases = computed(() => [
  {
    icon: 'i-lucide-settings',
    title: t('about.useCases.config.title'),
    description: t('about.useCases.config.description'),
  },
  {
    icon: 'i-lucide-database',
    title: t('about.useCases.data.title'),
    description: t('about.useCases.data.description'),
  },
  {
    icon: 'i-lucide-bot',
    title: t('about.useCases.ai.title'),
    description: t('about.useCases.ai.description'),
  },
  {
    icon: 'i-lucide-code',
    title: t('about.useCases.api.title'),
    description: t('about.useCases.api.description'),
  },
])
</script>

<template>
  <UDashboardPanel id="about-toon">
    <template #header>
      <UDashboardNavbar :title="t('about.title')" />
    </template>

    <template #body>
      <div class="overflow-y-auto h-full">
        <div class="max-w-5xl mx-auto p-6 pb-24">
          <!-- Hero Section -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <UIcon name="i-lucide-file-json" class="w-10 h-10 text-primary" />
            </div>
            <h1 class="text-4xl font-bold mb-4">
              {{ t('about.hero.title') }}
            </h1>
            <p class="text-lg text-muted max-w-2xl mx-auto">
              {{ t('about.hero.subtitle') }}
            </p>
            <div class="mt-6 flex gap-3 justify-center flex-wrap">
              <UBadge color="primary" variant="soft" size="lg">
                <UIcon name="i-lucide-file" class="w-4 h-4 mr-1" />
                .toon
              </UBadge>
              <UBadge color="neutral" variant="soft" size="lg">
                <UIcon name="i-lucide-code" class="w-4 h-4 mr-1" />
                text/toon
              </UBadge>
              <UBadge color="success" variant="soft" size="lg">
                <UIcon name="i-lucide-check" class="w-4 h-4 mr-1" />
                UTF-8
              </UBadge>
            </div>
          </div>

          <!-- Comparison Section -->
          <UCard class="mb-12">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-git-compare" class="w-5 h-5 text-primary" />
                <h2 class="text-xl font-semibold">
                  {{ t('about.comparison.title') }}
                </h2>
              </div>
            </template>

            <div class="grid md:grid-cols-2 gap-6">
              <!-- TOON Example -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <UBadge color="primary" variant="solid">
                    TOON
                  </UBadge>
                  <span class="text-sm text-muted">~65 {{ t('about.comparison.bytes') }}</span>
                </div>
                <pre class="bg-elevated rounded-lg p-4 text-sm overflow-x-auto font-mono">{{ toonExample }}</pre>
              </div>

              <!-- JSON Example -->
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <UBadge color="neutral" variant="soft">
                    JSON
                  </UBadge>
                  <span class="text-sm text-muted">~165 {{ t('about.comparison.bytes') }}</span>
                </div>
                <pre class="bg-elevated rounded-lg p-4 text-sm overflow-x-auto font-mono">{{ jsonExample }}</pre>
              </div>
            </div>

            <template #footer>
              <div class="flex items-center gap-2 text-sm text-muted">
                <UIcon name="i-lucide-trending-down" class="w-4 h-4 text-success" />
                <span>{{ t('about.comparison.savings') }}</span>
              </div>
            </template>
          </UCard>

          <!-- Features Grid -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6 text-center">
              {{ t('about.features.title') }}
            </h2>
            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <UCard v-for="feature in features" :key="feature.title" class="hover:border-primary transition-colors">
                <div class="flex items-start gap-4">
                  <div class="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <UIcon :name="feature.icon" class="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 class="font-semibold mb-1">
                      {{ feature.title }}
                    </h3>
                    <p class="text-sm text-muted">
                      {{ feature.description }}
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </div>

          <!-- Use Cases -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6 text-center">
              {{ t('about.useCases.title') }}
            </h2>
            <div class="grid sm:grid-cols-2 gap-4">
              <UCard v-for="useCase in useCases" :key="useCase.title">
                <div class="flex items-start gap-4">
                  <div class="shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UIcon :name="useCase.icon" class="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 class="font-semibold mb-1">
                      {{ useCase.title }}
                    </h3>
                    <p class="text-sm text-muted">
                      {{ useCase.description }}
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </div>

          <!-- Syntax Highlights -->
          <UCard class="mb-12">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-code-2" class="w-5 h-5 text-primary" />
                <h2 class="text-xl font-semibold">
                  {{ t('about.syntax.title') }}
                </h2>
              </div>
            </template>

            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <UBadge color="primary" variant="outline" class="mt-0.5">
                  1
                </UBadge>
                <div>
                  <h4 class="font-medium">
                    {{ t('about.syntax.indentation.title') }}
                  </h4>
                  <p class="text-sm text-muted">
                    {{ t('about.syntax.indentation.description') }}
                  </p>
                </div>
              </div>
              <USeparator />
              <div class="flex items-start gap-3">
                <UBadge color="primary" variant="outline" class="mt-0.5">
                  2
                </UBadge>
                <div>
                  <h4 class="font-medium">
                    {{ t('about.syntax.headers.title') }}
                  </h4>
                  <p class="text-sm text-muted">
                    {{ t('about.syntax.headers.description') }}
                  </p>
                </div>
              </div>
              <USeparator />
              <div class="flex items-start gap-3">
                <UBadge color="primary" variant="outline" class="mt-0.5">
                  3
                </UBadge>
                <div>
                  <h4 class="font-medium">
                    {{ t('about.syntax.primitives.title') }}
                  </h4>
                  <p class="text-sm text-muted">
                    {{ t('about.syntax.primitives.description') }}
                  </p>
                </div>
              </div>
              <USeparator />
              <div class="flex items-start gap-3">
                <UBadge color="primary" variant="outline" class="mt-0.5">
                  4
                </UBadge>
                <div>
                  <h4 class="font-medium">
                    {{ t('about.syntax.delimiters.title') }}
                  </h4>
                  <p class="text-sm text-muted">
                    {{ t('about.syntax.delimiters.description') }}
                  </p>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Call to Action -->
          <div class="text-center">
            <UCard class="bg-primary/5 border-primary/20">
              <div class="py-4">
                <h2 class="text-2xl font-bold mb-3">
                  {{ t('about.cta.title') }}
                </h2>
                <p class="text-muted mb-6 max-w-xl mx-auto">
                  {{ t('about.cta.description') }}
                </p>
                <div class="flex gap-3 justify-center flex-wrap">
                  <UButton to="/" icon="i-lucide-play" size="lg">
                    {{ t('about.cta.tryViewer') }}
                  </UButton>
                  <UButton
                    href="https://toonformat.dev"
                    target="_blank"
                    variant="outline"
                    icon="i-lucide-external-link"
                    size="lg"
                  >
                    {{ t('about.cta.learnMore') }}
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
