<script setup lang="ts">
const { t } = useI18n()

// SEO Meta Tags
useSeoMeta({
  title: () => t('seo.convert.title'),
  description: () => t('seo.convert.description'),
  ogTitle: () => t('seo.convert.title'),
  ogDescription: () => t('seo.convert.description'),
  ogType: 'website',
  ogSiteName: 'TOON NINJA',
  ogUrl: 'https://toon.ninja/convert',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.convert.title'),
  twitterDescription: () => t('seo.convert.description')
})

const steps = computed(() => [
  {
    icon: 'i-lucide-clipboard-paste',
    title: t('pages.convert.howItWorks.step1.title'),
    description: t('pages.convert.howItWorks.step1.description')
  },
  {
    icon: 'i-lucide-refresh-cw',
    title: t('pages.convert.howItWorks.step2.title'),
    description: t('pages.convert.howItWorks.step2.description')
  },
  {
    icon: 'i-lucide-copy',
    title: t('pages.convert.howItWorks.step3.title'),
    description: t('pages.convert.howItWorks.step3.description')
  }
])

const benefits = computed(() => [
  { icon: 'i-lucide-trending-down', text: t('pages.convert.benefits.tokenReduction') },
  { icon: 'i-lucide-minimize-2', text: t('pages.convert.benefits.smallerPayload') },
  { icon: 'i-lucide-eye', text: t('pages.convert.benefits.humanReadable') },
  { icon: 'i-lucide-check-circle', text: t('pages.convert.benefits.jsonCompatible') }
])
</script>

<template>
  <UDashboardPanel id="convert">
    <template #header>
      <UDashboardNavbar :title="t('nav.convert')" />
    </template>

    <template #body>
      <div class="overflow-y-auto h-full">
        <div class="max-w-5xl mx-auto p-6 pb-24">
          <!-- Hero Section -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <UIcon name="i-lucide-arrow-right-left" class="w-10 h-10 text-primary" />
            </div>
            <h1 class="text-4xl font-bold mb-4">
              {{ t('pages.convert.hero.title') }}
            </h1>
            <p class="text-lg text-muted max-w-2xl mx-auto mb-8">
              {{ t('pages.convert.hero.subtitle') }}
            </p>
            <UButton to="/" icon="i-lucide-play" size="xl">
              {{ t('pages.convert.cta') }}
            </UButton>
          </div>

          <!-- How It Works -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold mb-6 text-center">
              {{ t('pages.convert.howItWorks.title') }}
            </h2>
            <div class="grid md:grid-cols-3 gap-6">
              <div v-for="(step, index) in steps" :key="step.title" class="text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 relative">
                  <UIcon :name="step.icon" class="w-8 h-8 text-primary" />
                  <UBadge
                    color="primary"
                    variant="solid"
                    class="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center rounded-full text-xs"
                  >
                    {{ index + 1 }}
                  </UBadge>
                </div>
                <h3 class="font-semibold mb-2">
                  {{ step.title }}
                </h3>
                <p class="text-sm text-muted">
                  {{ step.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Benefits -->
          <UCard class="mb-12">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-sparkles" class="w-5 h-5 text-primary" />
                <h2 class="text-xl font-semibold">
                  {{ t('pages.convert.benefits.title') }}
                </h2>
              </div>
            </template>

            <div class="grid sm:grid-cols-2 gap-4">
              <div v-for="benefit in benefits" :key="benefit.text" class="flex items-center gap-3">
                <div class="shrink-0 w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <UIcon :name="benefit.icon" class="w-5 h-5 text-success" />
                </div>
                <span class="font-medium">{{ benefit.text }}</span>
              </div>
            </div>
          </UCard>

          <!-- CTA -->
          <div class="text-center">
            <UCard class="bg-primary/5 border-primary/20">
              <div class="py-4">
                <UButton to="/" icon="i-lucide-arrow-right" size="lg">
                  {{ t('pages.convert.cta') }}
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
