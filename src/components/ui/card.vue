<template>
  <div class="apple-card" :class="[appleShadow(), appleTransition(), cardStyle]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn, appleShadow, appleTransition } from '@/lib/utils'

defineOptions({
  name: 'AppCard',
})

type CardVariant = 'default' | 'elevated' | 'outline' | 'flat' | 'glass'

const props = defineProps({
  variant: {
    type: String as () => CardVariant,
    default: 'default',
  },
})

const cardStyle = computed(() => {
  const baseStyle = 'rounded-xl p-6'

  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-card text-card-foreground border border-border',
    elevated: 'bg-card text-card-foreground shadow-lg',
    outline: 'bg-background text-foreground border border-border',
    flat: 'bg-muted/50 text-muted-foreground',
    glass: 'bg-background/80 backdrop-blur-lg text-foreground border border-border/30',
  }

  return cn(baseStyle, variantStyles[props.variant])
})
</script>

<script lang="ts">
export default {
  displayName: 'Card',
}
</script>

<style scoped>
.apple-card {
  width: 100%;
  overflow: hidden;
}
</style>
