<template>
  <component
    :is="component"
    class="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    :class="[variants[variant as ButtonVariant], sizes[size as ButtonSize], appleTransition()]"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { appleTransition } from '@/lib/utils'

/**
 * 按钮变体类型
 */
type ButtonVariant =
  | 'default'
  | 'primary'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'apple'

/**
 * 按钮尺寸类型
 */
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

defineOptions({
  name: 'AppButton',
})

/**
 * 按钮属性接口
 * @property {ButtonVariant} [variant='default'] - 按钮样式变体
 * @property {ButtonSize} [size='default'] - 按钮尺寸
 * @property {string} [component='button'] - 按钮组件类型
 */
defineProps({
  variant: {
    type: String as () => ButtonVariant,
    default: 'default',
    validator: (value: string) => {
      return [
        'default',
        'primary',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'apple',
      ].includes(value)
    },
  },
  size: {
    type: String as () => ButtonSize,
    default: 'default',
    validator: (value: string) => {
      return ['default', 'sm', 'lg', 'icon'].includes(value)
    },
  },
  component: {
    type: String,
    default: 'button',
  },
})

/**
 * 按钮变体配置
 */
const variants: Record<ButtonVariant, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
  primary: 'bg-apple-blue text-white hover:bg-apple-blue-dark',
  apple:
    'bg-apple-blue text-white hover:bg-apple-blue-dark active:scale-[0.98] active:bg-apple-blue-dark apple-shadow hover:apple-shadow',
}

/**
 * 按钮尺寸配置
 */
const sizes: Record<ButtonSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
}
</script>
