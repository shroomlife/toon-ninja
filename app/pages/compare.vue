<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <UDashboardPanel id="compare" class="flex flex-col h-screen">
    <template #header>
      <UDashboardNavbar :title="t('diff.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <ToonDiffView class="h-full" />
    </template>
  </UDashboardPanel>
</template>
