<script setup lang="ts">
import type { ToonNode } from '~/stores/toon'

const props = defineProps<{
  node: ToonNode
  depth?: number
}>()

const emit = defineEmits<{
  toggle: [path: string[]]
  select: [path: string[]]
  delete: [path: string[]]
}>()

const depth = props.depth ?? 0

const hasChildren = computed(() => {
  return (props.node.type === 'object' || props.node.type === 'array')
    && props.node.children
    && props.node.children.length > 0
})

const displayValue = computed(() => {
  if (props.node.type === 'object') {
    const count = props.node.children?.length ?? 0
    return `{${count} ${count === 1 ? 'key' : 'keys'}}`
  }
  if (props.node.type === 'array') {
    const count = props.node.children?.length ?? 0
    return `[${count} ${count === 1 ? 'item' : 'items'}]`
  }
  if (props.node.type === 'string') {
    return `"${props.node.value}"`
  }
  if (props.node.type === 'null') {
    return 'null'
  }
  return String(props.node.value)
})

const typeColor = computed(() => {
  switch (props.node.type) {
    case 'string': return 'text-green-600 dark:text-green-400'
    case 'number': return 'text-blue-600 dark:text-blue-400'
    case 'boolean': return 'text-purple-600 dark:text-purple-400'
    case 'null': return 'text-neutral-500'
    case 'object': return 'text-yellow-600 dark:text-yellow-400'
    case 'array': return 'text-orange-600 dark:text-orange-400'
    default: return ''
  }
})

function handleToggle() {
  emit('toggle', props.node.path)
}

function handleSelect() {
  emit('select', props.node.path)
}

function handleDelete() {
  emit('delete', props.node.path)
}
</script>

<template>
  <div class="select-none">
    <div
      class="flex items-center gap-1 py-0.5 px-1 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 group"
      :style="{ paddingLeft: `${depth * 16 + 4}px` }"
      @click="handleSelect"
    >
      <!-- Expand/Collapse button -->
      <button
        v-if="hasChildren"
        class="p-0.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700"
        @click.stop="handleToggle"
      >
        <UIcon
          :name="node.expanded ? 'i-lucide-chevron-down' : 'i-lucide-chevron-right'"
          class="w-3 h-3"
        />
      </button>
      <span v-else class="w-4" />

      <!-- Type icon -->
      <UIcon
        :name="node.type === 'object' ? 'i-lucide-braces'
          : node.type === 'array' ? 'i-lucide-brackets'
            : node.type === 'string' ? 'i-lucide-text'
              : node.type === 'number' ? 'i-lucide-hash'
                : node.type === 'boolean' ? 'i-lucide-toggle-left'
                  : 'i-lucide-circle'"
        :class="typeColor"
        class="w-3.5 h-3.5 shrink-0"
      />

      <!-- Key -->
      <span class="font-medium text-neutral-800 dark:text-neutral-200 text-sm">
        {{ node.key }}
      </span>

      <span class="text-neutral-400">:</span>

      <!-- Value preview -->
      <span
        :class="typeColor"
        class="text-sm truncate max-w-[200px]"
      >
        {{ displayValue }}
      </span>

      <!-- Delete button (hidden until hover) -->
      <button
        class="ml-auto p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900 transition-opacity"
        @click.stop="handleDelete"
      >
        <UIcon name="i-lucide-trash-2" class="w-3 h-3 text-red-500" />
      </button>
    </div>

    <!-- Children -->
    <div v-if="hasChildren && node.expanded">
      <ToonTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        @toggle="$emit('toggle', $event)"
        @select="$emit('select', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </div>
</template>
