<script setup lang="ts">
const title = 'TOON Viewer'
const description = 'View and edit TOON data with a powerful editor featuring tree-view explorer, Monaco editor, live preview, search/filter, undo/redo, dark/light mode, import/export, and more.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
