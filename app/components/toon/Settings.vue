<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const settingsStore = useSettingsStore()
</script>

<template>
  <div class="p-4 space-y-6">
    <h3 class="font-semibold text-lg">
      {{ t('settings.title') }}
    </h3>

    <!-- Font Size -->
    <div>
      <label class="block text-sm font-medium mb-2">{{ t('settings.fontSize') }}</label>
      <div class="flex items-center gap-2">
        <UTooltip :text="t('hints.decreaseFontSize')">
          <UButton
            icon="i-lucide-minus"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="settingsStore.setFontSize(settingsStore.fontSize - 1)"
          />
        </UTooltip>
        <span class="w-8 text-center">{{ settingsStore.fontSize }}</span>
        <UTooltip :text="t('hints.increaseFontSize')">
          <UButton
            icon="i-lucide-plus"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="settingsStore.setFontSize(settingsStore.fontSize + 1)"
          />
        </UTooltip>
      </div>
    </div>

    <!-- Word Wrap -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium">{{ t('settings.wordWrap') }}</label>
      <USwitch
        :model-value="settingsStore.wordWrap"
        @update:model-value="settingsStore.toggleWordWrap"
      />
    </div>

    <!-- Line Numbers -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium">Line Numbers</label>
      <USwitch
        :model-value="settingsStore.showLineNumbers"
        @update:model-value="settingsStore.toggleLineNumbers"
      />
    </div>

    <!-- Minimap -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium">Minimap</label>
      <USwitch
        :model-value="settingsStore.showMinimap"
        @update:model-value="settingsStore.toggleMinimap"
      />
    </div>

    <!-- Auto Save -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium">{{ t('settings.autoSave') }}</label>
      <USwitch
        :model-value="settingsStore.autoSave"
        @update:model-value="settingsStore.toggleAutoSave"
      />
    </div>

    <!-- Tab Size -->
    <div>
      <label class="block text-sm font-medium mb-2">Tab Size</label>
      <div class="flex items-center gap-2">
        <UTooltip :text="t('hints.decreaseTabSize')">
          <UButton
            icon="i-lucide-minus"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="settingsStore.setTabSize(settingsStore.tabSize - 1)"
          />
        </UTooltip>
        <span class="w-8 text-center">{{ settingsStore.tabSize }}</span>
        <UTooltip :text="t('hints.increaseTabSize')">
          <UButton
            icon="i-lucide-plus"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="settingsStore.setTabSize(settingsStore.tabSize + 1)"
          />
        </UTooltip>
      </div>
    </div>
  </div>
</template>
