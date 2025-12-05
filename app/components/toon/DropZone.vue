<script setup lang="ts">
const { t } = useI18n()
const toonStore = useToonStore()
const toast = useToast()

const isDragOver = ref(false)
const fileInput = ref<HTMLInputElement>()

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = true
}

function handleDragLeave() {
  isDragOver.value = false
}

async function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragOver.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    await processFile(files[0] as File)
  }
}

function handleClick() {
  fileInput.value?.click()
}

async function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    await processFile(files[0] as File)
  }
  // Reset input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function processFile(file: File) {
  const validTypes = ['application/json', 'text/plain']
  const validExtensions = ['.json', '.toon']

  const hasValidType = validTypes.includes(file.type)
  const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

  if (!hasValidType && !hasValidExtension) {
    toast.add({
      title: t('errors.invalidData'),
      description: 'Please upload a .json or .toon file',
      color: 'error',
    })
    return
  }

  try {
    const content = await file.text()
    toonStore.setContent(content)
    toast.add({
      title: t('success.imported'),
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: t('errors.importError'),
      color: 'error',
    })
  }
}
</script>

<template>
  <div
    class="relative border-2 border-dashed rounded-lg transition-colors cursor-pointer"
    :class="[
      isDragOver
        ? 'border-primary bg-primary/5'
        : 'border-default hover:border-primary/50',
    ]"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @click="handleClick"
  >
    <input
      ref="fileInput"
      type="file"
      accept=".json,.toon,application/json"
      class="hidden"
      @change="handleFileSelect"
    >

    <div class="flex flex-col items-center justify-center py-8 px-4">
      <UIcon
        name="i-lucide-upload-cloud"
        class="w-12 h-12 mb-3"
        :class="isDragOver ? 'text-primary' : 'text-neutral-400'"
      />
      <p class="text-sm font-medium mb-1">
        {{ t('dropzone.title') }}
      </p>
      <p class="text-xs text-neutral-500">
        {{ t('dropzone.subtitle') }}
      </p>
      <p class="text-xs text-neutral-400 mt-2">
        {{ t('dropzone.accept') }}
      </p>
    </div>
  </div>
</template>
