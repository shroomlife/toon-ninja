<script setup lang="ts">
import type { ToonTreeItem } from '~/stores/toon'

interface Props {
  item: ToonTreeItem
  mode: 'edit' | 'addChild' | 'addSibling'
}

const props = defineProps<Props>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const toonStore = useToonStore()
const toast = useToast()

// Form state
const formKey = ref('')
const formValue = ref('')
const formType = ref<'string' | 'number' | 'boolean' | 'null' | 'object' | 'array'>('string')
const keyError = ref('')
const valueError = ref('')

// Type options
const typeOptions = [
  { label: t('editModal.types.string'), value: 'string', icon: 'i-lucide-text' },
  { label: t('editModal.types.number'), value: 'number', icon: 'i-lucide-hash' },
  { label: t('editModal.types.boolean'), value: 'boolean', icon: 'i-lucide-toggle-left' },
  { label: t('editModal.types.null'), value: 'null', icon: 'i-lucide-circle-slash' },
  { label: t('editModal.types.object'), value: 'object', icon: 'i-lucide-braces' },
  { label: t('editModal.types.array'), value: 'array', icon: 'i-lucide-list' }
]

// Boolean options
const booleanOptions = [
  { label: 'true', value: 'true' },
  { label: 'false', value: 'false' }
]

// Initialize form based on mode
watchEffect(() => {
  if (props.mode === 'edit') {
    formKey.value = props.item.label
    formType.value = props.item.type as typeof formType.value

    if (props.item.type === 'null') {
      formValue.value = ''
    } else if (props.item.type === 'boolean') {
      formValue.value = props.item.value ? 'true' : 'false'
    } else if (props.item.type === 'object' || props.item.type === 'array') {
      formValue.value = ''
    } else {
      formValue.value = String(props.item.value ?? '')
    }
  } else {
    // Adding new node
    formKey.value = ''
    formValue.value = ''
    formType.value = 'string'
  }

  keyError.value = ''
  valueError.value = ''
})

// Computed: modal title
const modalTitle = computed(() => {
  return props.mode === 'edit'
    ? t('editModal.title')
    : t('editModal.addTitle')
})

// Computed: show key input (not needed for array indices when editing)
const showKeyInput = computed(() => {
  if (props.mode === 'edit') {
    // Don't show key for array items (numeric keys)
    const parentPath = props.item.path.slice(0, -1)
    const parent = toonStore.getNodeByPath(parentPath)
    return !(Array.isArray(parent))
  }

  if (props.mode === 'addChild') {
    // For adding child to array, key is not needed
    return props.item.type !== 'array'
  }

  // For sibling, check parent type
  const parentPath = props.item.path.slice(0, -1)
  const parent = toonStore.getNodeByPath(parentPath)
  return !(Array.isArray(parent))
})

// Computed: show value input
const showValueInput = computed(() => {
  return formType.value !== 'object' && formType.value !== 'array' && formType.value !== 'null'
})

// Parse value based on type
const parseValue = (): unknown => {
  switch (formType.value) {
    case 'string':
      return formValue.value
    case 'number':
      return Number(formValue.value)
    case 'boolean':
      return formValue.value === 'true'
    case 'null':
      return null
    case 'object':
      return {}
    case 'array':
      return []
    default:
      return formValue.value
  }
}

// Computed: TOON preview (live updates)
const toonPreview = computed(() => {
  if (props.mode !== 'edit') return null

  // Validate number if needed
  if (formType.value === 'number') {
    const num = Number(formValue.value)
    if (isNaN(num)) return null
  }

  const value = parseValue()
  const key = showKeyInput.value ? formKey.value.trim() : undefined

  return toonStore.previewEdit(props.item.path, value, key)
})

// Validate form
const validate = (): boolean => {
  keyError.value = ''
  valueError.value = ''

  if (showKeyInput.value && !formKey.value.trim()) {
    keyError.value = t('editModal.keyRequired')
    return false
  }

  if (formType.value === 'number' && showValueInput.value) {
    const num = Number(formValue.value)
    if (isNaN(num)) {
      valueError.value = t('editModal.invalidNumber')
      return false
    }
  }

  return true
}

// Handle save
const handleSave = () => {
  if (!validate()) return

  const value = parseValue()
  const key = showKeyInput.value ? formKey.value.trim() : undefined

  try {
    if (props.mode === 'edit') {
      // Edit existing node
      toonStore.editNode(props.item.path, value, key)
    } else if (props.mode === 'addChild') {
      // Add child to current node
      toonStore.addNode(props.item.path, value, key)
    } else {
      // Add sibling (add to parent)
      const parentPath = props.item.path.slice(0, -1)
      toonStore.addNode(parentPath, value, key)
    }

    toast.add({
      title: t('success.saved'),
      color: 'success',
      icon: 'i-lucide-check-circle'
    })

    open.value = false
    emit('close')
  } catch (e) {
    toast.add({
      title: t('errors.invalidData'),
      description: e instanceof Error ? e.message : String(e),
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
  }
}

// Handle cancel
const handleCancel = () => {
  open.value = false
  emit('close')
}
</script>

<template>
  <UModal v-model:open="open">
    <template #content>
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ modalTitle }}
          </h3>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="handleCancel"
          />
        </div>

        <!-- Form -->
        <div class="space-y-4">
          <!-- Key input -->
          <div v-if="showKeyInput">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('editModal.key') }}
            </label>
            <UInput
              v-model="formKey"
              :placeholder="t('editModal.keyPlaceholder')"
              :error="!!keyError"
            />
            <p v-if="keyError" class="mt-1 text-sm text-red-500">
              {{ keyError }}
            </p>
          </div>

          <!-- Type selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('editModal.type') }}
            </label>
            <USelectMenu
              v-model="formType"
              :items="typeOptions"
              value-key="value"
            >
              <template #leading="{ modelValue }">
                <UIcon
                  v-if="typeOptions.find(o => o.value === modelValue)?.icon"
                  :name="typeOptions.find(o => o.value === modelValue)?.icon || ''"
                  class="w-4 h-4"
                />
              </template>
            </USelectMenu>
          </div>

          <!-- Value input -->
          <div v-if="showValueInput">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('editModal.value') }}
            </label>

            <!-- Boolean selector -->
            <USelectMenu
              v-if="formType === 'boolean'"
              v-model="formValue"
              :items="booleanOptions"
              value-key="value"
            />

            <!-- Number input -->
            <UInput
              v-else-if="formType === 'number'"
              v-model="formValue"
              type="number"
              :placeholder="t('editModal.valuePlaceholder')"
              :error="!!valueError"
            />

            <!-- String textarea -->
            <UTextarea
              v-else
              v-model="formValue"
              :placeholder="t('editModal.valuePlaceholder')"
              :rows="3"
            />

            <p v-if="valueError" class="mt-1 text-sm text-red-500">
              {{ valueError }}
            </p>
          </div>

          <!-- Info for container types -->
          <div v-if="formType === 'object' || formType === 'array'" class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ formType === 'object'
                ? 'An empty object will be created. You can add properties using the context menu.'
                : 'An empty array will be created. You can add items using the context menu.'
              }}
            </p>
          </div>

          <!-- TOON Preview (only for edit mode) -->
          <div v-if="mode === 'edit' && toonPreview" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('editModal.preview') }}
            </label>
            <div class="relative">
              <pre class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-mono overflow-auto max-h-32 text-gray-700 dark:text-gray-300">{{ toonPreview }}</pre>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {{ t('editModal.previewHint') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-2 mt-6">
          <UButton
            color="neutral"
            variant="ghost"
            @click="handleCancel"
          >
            {{ t('editModal.cancel') }}
          </UButton>
          <UButton
            color="primary"
            @click="handleSave"
          >
            {{ t('editModal.save') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
