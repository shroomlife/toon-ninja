<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// SEO Meta Tags - static values for SSR hydration compatibility
useSeoMeta({
  title: 'Reduce LLM Token Costs - TOON NINJA',
  description: 'Cut OpenAI and Anthropic API costs by 30-60%. TOON NINJA converts your JSON to token-efficient TOON format for ChatGPT, Claude and other LLMs.',
  ogTitle: 'Reduce LLM Token Costs - TOON NINJA',
  ogDescription: 'Cut OpenAI and Anthropic API costs by 30-60%. TOON NINJA converts your JSON to token-efficient TOON format for ChatGPT, Claude and other LLMs.',
  ogType: 'website',
  ogSiteName: 'TOON NINJA',
  ogUrl: 'https://toon.ninja/token-optimization',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Reduce LLM Token Costs - TOON NINJA',
  twitterDescription: 'Cut OpenAI and Anthropic API costs by 30-60%. TOON NINJA converts your JSON to token-efficient TOON format for ChatGPT, Claude and other LLMs.',
})
</script>

<template>
  <UDashboardPanel id="token-optimization">
    <template #header>
      <UDashboardNavbar :title="t('nav.tokenOptimization')" />
    </template>

    <template #body>
      <div class="overflow-y-auto h-full">
        <div class="max-w-5xl mx-auto p-6 pb-24">
          <!-- Hero Section -->
          <div class="text-center mb-12">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
              <UIcon name="i-lucide-piggy-bank" class="w-10 h-10 text-success" />
            </div>
            <h1 class="text-4xl font-bold mb-4">
              {{ t('pages.tokenOptimization.hero.title') }}
            </h1>
            <p class="text-lg text-muted max-w-2xl mx-auto">
              {{ t('pages.tokenOptimization.hero.subtitle') }}
            </p>
          </div>

          <!-- The JSON Problem -->
          <UCard class="mb-8">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-alert-triangle" class="w-5 h-5 text-warning" />
                <h2 class="text-xl font-semibold">
                  {{ t('pages.tokenOptimization.problem.title') }}
                </h2>
              </div>
            </template>

            <p class="text-muted">
              {{ t('pages.tokenOptimization.problem.description') }}
            </p>
          </UCard>

          <!-- The Solution -->
          <UCard class="mb-8">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-lightbulb" class="w-5 h-5 text-success" />
                <h2 class="text-xl font-semibold">
                  {{ t('pages.tokenOptimization.solution.title') }}
                </h2>
              </div>
            </template>

            <p class="text-muted mb-4">
              {{ t('pages.tokenOptimization.solution.description') }}
            </p>
            <UButton
              to="/about"
              variant="link"
              icon="i-lucide-arrow-right"
              class="px-0"
            >
              {{ t('pages.tokenOptimization.solution.learnMore') }}
            </UButton>
          </UCard>

          <!-- Savings Example -->
          <UCard class="mb-12 bg-success/5 border-success/20">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-calculator" class="w-5 h-5 text-success" />
                <h2 class="text-xl font-semibold">
                  {{ t('pages.tokenOptimization.savings.title') }}
                </h2>
              </div>
            </template>

            <p class="text-muted mb-6">
              {{ t('pages.tokenOptimization.savings.description') }}
            </p>

            <div class="grid sm:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-elevated rounded-lg">
                <div class="text-3xl font-bold text-primary mb-1">
                  $100
                </div>
                <div class="text-sm text-muted">
                  {{ t('pages.tokenOptimization.savings.monthly') }}
                </div>
              </div>
              <div class="text-center p-4 bg-elevated rounded-lg">
                <div class="text-3xl font-bold text-warning mb-1">
                  30%
                </div>
                <div class="text-sm text-muted">
                  {{ t('pages.tokenOptimization.savings.structuredData') }}
                </div>
              </div>
              <div class="text-center p-4 bg-elevated rounded-lg">
                <div class="text-3xl font-bold text-success mb-1">
                  $12-18
                </div>
                <div class="text-sm text-muted">
                  {{ t('pages.tokenOptimization.savings.savings') }}
                </div>
              </div>
            </div>
          </UCard>

          <!-- CTA -->
          <div class="text-center">
            <UCard class="bg-primary/5 border-primary/20">
              <div class="py-4 flex gap-4 justify-center flex-wrap">
                <UButton to="/" icon="i-lucide-play" size="lg">
                  {{ t('pages.tokenOptimization.cta.primary') }}
                </UButton>
                <UButton
                  to="/about"
                  variant="outline"
                  icon="i-lucide-book-open"
                  size="lg"
                >
                  {{ t('pages.tokenOptimization.cta.secondary') }}
                </UButton>
              </div>
            </UCard>
          </div>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>
