<script setup lang="ts">
const { t } = useI18n()

// SEO Meta Tags
useSeoMeta({
  title: () => t('seo.features.title'),
  description: () => t('seo.features.description'),
  ogTitle: () => t('seo.features.title'),
  ogDescription: () => t('seo.features.description'),
  ogType: 'website',
  ogSiteName: 'TOON NINJA',
  ogUrl: 'https://toon.ninja/features',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.features.title'),
  twitterDescription: () => t('seo.features.description')
})

const features = computed(() => [
  {
    icon: 'i-lucide-code-2',
    title: t('pages.features.list.monaco.title'),
    description: t('pages.features.list.monaco.description')
  },
  {
    icon: 'i-lucide-arrow-right-left',
    title: t('pages.features.list.conversion.title'),
    description: t('pages.features.list.conversion.description')
  },
  {
    icon: 'i-lucide-shield-check',
    title: t('pages.features.list.validation.title'),
    description: t('pages.features.list.validation.description')
  },
  {
    icon: 'i-lucide-git-compare',
    title: t('pages.features.list.diff.title'),
    description: t('pages.features.list.diff.description')
  },
  {
    icon: 'i-lucide-layers',
    title: t('pages.features.list.batch.title'),
    description: t('pages.features.list.batch.description')
  },
  {
    icon: 'i-lucide-keyboard',
    title: t('pages.features.list.shortcuts.title'),
    description: t('pages.features.list.shortcuts.description')
  },
  {
    icon: 'i-lucide-moon',
    title: t('pages.features.list.darkMode.title'),
    description: t('pages.features.list.darkMode.description')
  },
  {
    icon: 'i-lucide-user-x',
    title: t('pages.features.list.noAccount.title'),
    description: t('pages.features.list.noAccount.description')
  }
])
</script>

<template>
  <UDashboardPanel id="features">
    <template #header>
      <UDashboardNavbar :title="t('nav.features')" />
    </template>

    <template #body>
      <div class="overflow-y-auto h-full">
        <div class="max-w-5xl mx-auto p-6 pb-24">
          <!-- Hero Section -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <UIcon name="i-lucide-zap" class="w-10 h-10 text-primary" />
            </div>
            <h1 class="text-4xl font-bold mb-4">
              {{ t('pages.features.hero.title') }}
            </h1>
            <p class="text-lg text-muted max-w-2xl mx-auto">
              {{ t('pages.features.hero.subtitle') }}
            </p>
          </div>

          <!-- Features Grid -->
          <div class="mb-12">
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <UCard v-for="feature in features" :key="feature.title" class="hover:border-primary transition-colors">
                <div class="text-center">
                  <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <UIcon :name="feature.icon" class="w-6 h-6 text-primary" />
                  </div>
                  <h3 class="font-semibold mb-2">
                    {{ feature.title }}
                  </h3>
                  <p class="text-sm text-muted">
                    {{ feature.description }}
                  </p>
                </div>
              </UCard>
            </div>
          </div>

          <!-- CTA -->
          <div class="text-center">
            <UCard class="bg-primary/5 border-primary/20">
              <div class="py-4">
                <UButton to="/" icon="i-lucide-play" size="lg">
                  {{ t('pages.features.cta') }}
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
