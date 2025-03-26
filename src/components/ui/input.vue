<template>
  <input
    class="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
    :class="[appleTransition(), { 'apple-shadow': shadow }]"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { appleTransition } from '@/lib/utils'

defineOptions({
  name: 'AppInput',
  inheritAttrs: false,
})

/**
 * 输入框组件Props
 * @property {boolean} shadow - 是否显示阴影效果
 */
defineProps({
  shadow: {
    type: Boolean,
    default: false,
  },
})
</script>
