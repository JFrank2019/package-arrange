<script setup lang="ts">
import { useCalculatorStore } from '@/stores/calculator'

defineProps<{
  calculating: boolean
}>()

const store = useCalculatorStore()
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8 calculation-result transition-opacity duration-300"
    :class="{ 'opacity-0': calculating, 'opacity-100': !calculating }"
  >
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200">计算结果</h2>
      <button
        @click="store.resetResult()"
        class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
        <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">目标值</p>
          <p class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {{ store.calculatedTarget }}
          </p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">最接近的和</p>
          <p class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {{ store.result?.sum }}
          </p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">差值</p>
          <div class="text-lg font-medium text-gray-700 dark:text-gray-200">
            还差：
            {{ store.calculatedTarget && store.calculatedTarget - (store.result?.sum || 0) }}
          </div>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">优先数字使用次数</p>
          <p class="text-2xl font-semibold text-blue-500">
            {{ store.priorityNumber }}: {{ store.result?.priorityCount }}次
          </p>
        </div>
      </div>

      <!-- 数字组合结果 -->
      <div class="border-t dark:border-gray-700 pt-6">
        <p class="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">使用的数字组合</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <template v-for="(count, number) in store.result?.combination || {}" :key="number">
            <div
              v-if="count > 0"
              :class="
                String(number) === String(store.priorityNumber)
                  ? 'text-blue-500'
                  : 'text-gray-700 dark:text-gray-200'
              "
              class="flex items-center space-x-2"
            >
              <span class="font-medium">{{ number }}</span>
              <span>×</span>
              <span>{{ count }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
