<script setup lang="ts">
import { useCalculatorStore } from '@/stores/calculator'

defineProps<{
  calculating: boolean
}>()

const store = useCalculatorStore()
</script>

<template>
  <div
    class="bg-card rounded-lg shadow-md p-6 mt-8 calculation-result transition-opacity duration-300 border"
    :class="{ 'opacity-0': calculating, 'opacity-100': !calculating }"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-foreground">计算结果</h2>
      <button
        @click="store.resetResult()"
        class="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-muted/30"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div class="space-y-6">
      <!-- 数据概览卡片 -->
      <div class="grid grid-cols-2 gap-4">
        <div class="result-card">
          <p class="text-sm text-muted-foreground mb-2">目标值</p>
          <p class="text-2xl font-semibold text-foreground">
            {{ store.calculatedTarget }}
          </p>
        </div>
        <div class="result-card">
          <p class="text-sm text-muted-foreground mb-2">最接近的和</p>
          <p class="text-2xl font-semibold text-foreground">
            {{ store.result?.sum }}
          </p>
        </div>
        <div class="result-card">
          <p class="text-sm text-muted-foreground mb-2">差值</p>
          <div class="text-lg font-medium text-foreground">
            还差：
            <span class="font-semibold">{{
              store.calculatedTarget && store.calculatedTarget - (store.result?.sum || 0)
            }}</span>
          </div>
        </div>
        <div class="result-card">
          <p class="text-sm text-muted-foreground mb-2">优先数字使用次数</p>
          <p class="text-2xl font-semibold text-primary">
            {{ store.priorityNumber }}: {{ store.result?.priorityCount }}次
          </p>
        </div>
      </div>

      <!-- 数字组合结果 -->
      <div class="border-t border-border pt-6">
        <p class="text-lg font-medium text-foreground mb-4">使用的数字组合</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <template v-for="(count, number) in store.result?.combination || {}" :key="number">
            <div
              v-if="count > 0"
              :class="
                String(number) === String(store.priorityNumber) ? 'combo-item-active' : 'combo-item'
              "
            >
              <span class="font-medium text-lg">{{ number }}</span>
              <span>×</span>
              <span class="font-semibold">{{ count }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-card {
  @apply bg-muted/30 p-6 rounded-lg shadow-sm border border-border/60 hover:border-primary/20 hover:shadow-md transition-all duration-200;
}

.combo-item {
  @apply flex items-center space-x-2 p-3 rounded-md bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors;
}

.combo-item-active {
  @apply flex items-center space-x-2 p-3 rounded-md bg-primary/10 border border-primary/30 text-primary hover:bg-primary/15 transition-colors;
}

/* 暗色模式增强 */
:global(.dark) .result-card {
  background-color: rgba(30, 41, 59, 0.3);
  border-color: rgba(59, 130, 246, 0.15);
}

:global(.dark) .combo-item {
  background-color: rgba(30, 41, 59, 0.4);
  border-color: rgba(30, 41, 59, 0.8);
}

:global(.dark) .combo-item-active {
  background-color: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}
</style>
