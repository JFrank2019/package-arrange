<script setup lang="ts">
defineOptions({
  name: 'NumberCalculator',
})

import { ref, computed, watch, nextTick } from 'vue'
import { useCalculatorStore } from '@/stores/calculator'
import CalculatorConfig from './calculator/CalculatorConfig.vue'
import CalculatorResult from './calculator/CalculatorResult.vue'
import ErrorDisplay from './calculator/ErrorDisplay.vue'

const store = useCalculatorStore()

// 计算状态
const calculating = ref(false)
const userInteracted = ref(false)

// 计算方法
const calculate = async () => {
  if (calculating.value) return

  calculating.value = true

  try {
    store.validateInput()
    await new Promise((resolve) => setTimeout(resolve, 300))
    const result = await store.calculateResult()

    if (!result) {
      throw new Error('计算失败，请检查输入参数')
    }

    nextTick(() => {
      const resultElement = document.querySelector('.calculation-result')
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      store.setErrors(error.message.split('\n'))
    }
  } finally {
    calculating.value = false
  }
}

// 监听用户输入
watch(
  () => ({
    numbers: [...store.numbers],
    target: store.target,
    priorityNumber: store.priorityNumber,
  }),
  () => {
    if (!userInteracted.value) {
      userInteracted.value = true
    }
    store.resetResult()
    store.validateInputRealTime()
  },
  { deep: true },
)
</script>

<template>
  <div class="calculator-container">
    <div class="calculator transform transition-all duration-300 hover:scale-[1.01]">
      <div class="max-w-4xl mx-auto space-y-6">
        <h1
          class="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100 tracking-tight"
        >
          数字组合计算器
        </h1>

        <CalculatorConfig />

        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition-all duration-300"
        >
          <div class="space-y-4">
            <ErrorDisplay
              :errors="store.errors"
              :show="store.errors.length > 0 && userInteracted"
              :calculating="calculating"
            />

            <button
              @click="calculate"
              :disabled="calculating || store.errors.length > 0"
              class="ripple px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-green-600 text-lg font-medium relative overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span v-if="calculating" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                计算中...
              </span>
              <span v-else>开始计算</span>
            </button>
          </div>
        </div>

        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 transform translate-y-4"
          enter-to-class="opacity-100 transform translate-y-0"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 transform translate-y-0"
          leave-to-class="opacity-0 transform translate-y-4"
        >
          <CalculatorResult
            v-if="store.result && store.calculatedTarget !== null"
            :calculating="calculating"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calculator-container {
  width: 100%;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
}

.calculator {
  width: 100%;
  max-width: 900px;
  background-color: var(--bg-secondary);
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dark .calculator {
  background-color: var(--bg-secondary, rgb(31, 41, 55));
}

/* 响应式调整 */
@media (max-width: 840px) {
  .calculator-container {
    padding: 1rem;
  }

  .calculator {
    padding: 2rem;
    border-radius: 1rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem !important;
  }
}

@media (max-width: 480px) {
  .calculator-container {
    padding: 0;
  }

  .calculator {
    margin: 0;
    padding: 1rem;
    border-radius: 0;
    border: none;
  }

  h1 {
    font-size: 1.75rem;
    margin-bottom: 1rem !important;
  }
}

/* 波纹效果 */
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.7) 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition:
    transform 0.5s,
    opacity 1s;
}

.ripple:active::after {
  transform: scale(0, 0);
  opacity: 0.3;
  transition: 0s;
}
</style>
