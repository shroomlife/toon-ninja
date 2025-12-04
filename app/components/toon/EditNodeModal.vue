<script setup lang="ts">
import type { ToonTreeItem } from '~/stores/toon'

interface Props {
  item: ToonTreeItem
  mode: 'edit' | 'addChild' | 'addSibling'
}

interface SmartField {
  key: string
  type: 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array'
  value: string
  example?: string
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

// Smart form state (for adding to arrays of objects)
const useSmartForm = ref(false)
const smartFields = ref<SmartField[]>([])

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

// Detect type from value
const detectType = (value: unknown): SmartField['type'] => {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string') return 'string'
  if (Array.isArray(value)) return 'array'
  if (typeof value === 'object') return 'object'
  return 'string'
}

// Analyze sibling objects to detect common structure
const analyzeStructure = (): SmartField[] => {
  // Only for addChild mode on arrays containing objects
  if (props.mode !== 'addChild' || props.item.type !== 'array') return []

  const children = props.item.children
  if (!children || children.length === 0) return []

  // Find all object children and collect their keys
  const fieldMap = new Map<string, { type: SmartField['type'], examples: unknown[] }>()

  for (const child of children) {
    if (child.type === 'object' && child.children) {
      for (const prop of child.children) {
        const existing = fieldMap.get(prop.label)
        if (existing) {
          existing.examples.push(prop.value)
        } else {
          fieldMap.set(prop.label, {
            type: detectType(prop.value),
            examples: [prop.value]
          })
        }
      }
    }
  }

  // Convert to SmartField array
  const fields: SmartField[] = []
  for (const [key, data] of fieldMap) {
    const example = data.examples[0]
    fields.push({
      key,
      type: data.type,
      value: data.type === 'boolean' ? 'false' : '',
      example: example !== undefined && example !== null
        ? String(example).substring(0, 30)
        : undefined
    })
  }

  return fields
}

// Build smart fields from existing object (for edit mode)
const buildFieldsFromObject = (): SmartField[] => {
  if (props.item.type !== 'object' || !props.item.children) return []

  const fields: SmartField[] = []
  for (const child of props.item.children) {
    fields.push({
      key: child.label,
      type: child.type as SmartField['type'],
      value: child.type === 'boolean'
        ? (child.value ? 'true' : 'false')
        : child.type === 'null'
          ? ''
          : String(child.value ?? '')
    })
  }
  return fields
}

// Initialize form based on mode
watchEffect(() => {
  if (props.mode === 'edit') {
    formKey.value = props.item.label
    formType.value = props.item.type as typeof formType.value

    if (props.item.type === 'null') {
      formValue.value = ''
      useSmartForm.value = false
      smartFields.value = []
    } else if (props.item.type === 'boolean') {
      formValue.value = props.item.value ? 'true' : 'false'
      useSmartForm.value = false
      smartFields.value = []
    } else if (props.item.type === 'object') {
      // Use smart form for editing objects
      formValue.value = ''
      const fields = buildFieldsFromObject()
      if (fields.length > 0) {
        useSmartForm.value = true
        smartFields.value = fields
      } else {
        useSmartForm.value = false
        smartFields.value = []
      }
    } else if (props.item.type === 'array') {
      formValue.value = ''
      useSmartForm.value = false
      smartFields.value = []
    } else {
      formValue.value = String(props.item.value ?? '')
      useSmartForm.value = false
      smartFields.value = []
    }
  } else {
    // Adding new node - check for smart form
    formKey.value = ''
    formValue.value = ''
    formType.value = 'string'

    const detected = analyzeStructure()
    if (detected.length > 0) {
      useSmartForm.value = true
      smartFields.value = detected
    } else {
      useSmartForm.value = false
      smartFields.value = []
    }
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

// Parse smart field value based on type
const parseSmartFieldValue = (field: SmartField): unknown => {
  switch (field.type) {
    case 'string':
      return field.value
    case 'number':
      return field.value ? Number(field.value) : 0
    case 'boolean':
      return field.value === 'true'
    case 'null':
      return null
    case 'object':
      return {}
    case 'array':
      return []
    default:
      return field.value
  }
}

// Build object from smart fields
const buildSmartObject = (): Record<string, unknown> => {
  const obj: Record<string, unknown> = {}
  for (const field of smartFields.value) {
    obj[field.key] = parseSmartFieldValue(field)
  }
  return obj
}

// Validate form
const validate = (): boolean => {
  keyError.value = ''
  valueError.value = ''

  // Smart form validation
  if (useSmartForm.value) {
    for (const field of smartFields.value) {
      if (field.type === 'number' && field.value) {
        const num = Number(field.value)
        if (isNaN(num)) {
          valueError.value = `${field.key}: ${t('editModal.invalidNumber')}`
          return false
        }
      }
    }
    return true
  }

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

  try {
    if (useSmartForm.value) {
      // Smart form: build object
      const obj = buildSmartObject()

      if (props.mode === 'edit') {
        // Edit existing object - replace with updated values
        toonStore.editNode(props.item.path, obj, showKeyInput.value ? formKey.value.trim() : undefined)
      } else {
        // Add new object to array
        toonStore.addNode(props.item.path, obj)
      }
    } else {
      const value = parseValue()
      const key = showKeyInput.value ? formKey.value.trim() : undefined

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

        <!-- Smart Form (for adding to arrays of objects) -->
        <div v-if="useSmartForm" class="space-y-4">
          <div class="flex items-center gap-2 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg mb-4">
            <UIcon name="i-lucide-sparkles" class="w-4 h-4 text-primary" />
            <span class="text-sm text-primary">{{ t('editModal.smartForm') || 'Smart form based on existing items' }}</span>
          </div>

          <div v-for="field in smartFields" :key="field.key" class="space-y-1">
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <UIcon :name="typeOptions.find(o => o.value === field.type)?.icon || 'i-lucide-file'" class="w-3.5 h-3.5" />
              {{ field.key }}
              <span v-if="field.example" class="text-xs text-gray-400 font-normal truncate max-w-32">
                ({{ field.example }})
              </span>
            </label>

            <!-- Boolean -->
            <USelectMenu
              v-if="field.type === 'boolean'"
              v-model="field.value"
              class="w-full"
              :items="booleanOptions"
              value-key="value"
            />

            <!-- Number -->
            <UInput
              v-else-if="field.type === 'number'"
              v-model="field.value"
              class="w-full"
              type="number"
              :placeholder="field.example || '0'"
            />

            <!-- String -->
            <UInput
              v-else-if="field.type === 'string'"
              v-model="field.value"
              class="w-full"
              :placeholder="field.example || ''"
            />

            <!-- Other types (object, array, null) -->
            <div v-else class="p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs text-gray-500">
              {{ field.type === 'null' ? 'null' : `Empty ${field.type}` }}
            </div>
          </div>

          <p v-if="valueError" class="text-sm text-red-500">
            {{ valueError }}
          </p>

          <!-- Switch to manual form -->
          <button
            type="button"
            class="text-xs text-gray-500 hover:text-primary underline"
            @click="useSmartForm = false"
          >
            {{ t('editModal.manualEntry') || 'Switch to manual entry' }}
          </button>
        </div>

        <!-- Regular Form -->
        <div v-else class="space-y-4">
          <!-- Key input -->
          <div v-if="showKeyInput">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('editModal.key') }}
            </label>
            <UInput
              v-model="formKey"
              class="w-full"
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
              class="w-full"
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
              class="w-full"
              :items="booleanOptions"
              value-key="value"
            />

            <!-- Number input -->
            <UInput
              v-else-if="formType === 'number'"
              v-model="formValue"
              class="w-full"
              type="number"
              :placeholder="t('editModal.valuePlaceholder')"
              :error="!!valueError"
            />

            <!-- String textarea -->
            <UTextarea
              v-else
              v-model="formValue"
              class="w-full"
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
                ? 'An empty object will be created. You can add properties after creation.'
                : 'An empty array will be created. You can add items after creation.'
              }}
            </p>
          </div>

          <!-- Switch back to smart form if available -->
          <button
            v-if="smartFields.length > 0"
            type="button"
            class="text-xs text-gray-500 hover:text-primary underline"
            @click="useSmartForm = true"
          >
            {{ t('editModal.useSmartForm') || 'Use smart form' }}
          </button>
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
