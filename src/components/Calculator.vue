<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useCalculatorStore } from '@/stores/calculator'
import CalculatorConfig from './calculator/CalculatorConfig.vue'
import CalculatorResult from './calculator/CalculatorResult.vue'
import ErrorDisplay from './calculator/ErrorDisplay.vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

defineOptions({
  name: 'NumberCalculator',
})

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
    <Card class="calculator shadow-lg">
      <div class="max-w-4xl mx-auto space-y-6">
        <h1 class="text-4xl font-bold text-center mb-8 text-foreground font-display tracking-tight">
          数字组合计算器
        </h1>

        <CalculatorConfig />

        <Card class="space-y-4 p-6">
          <ErrorDisplay
            :errors="store.errors"
            :show="store.errors.length > 0 && userInteracted"
            :calculating="calculating"
          />

          <Button
            @click="calculate"
            :disabled="calculating || store.errors.length > 0"
            variant="default"
            size="lg"
            class="w-full text-lg font-medium"
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
          </Button>
        </Card>

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
    </Card>
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
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  @apply bg-card text-card-foreground;
}

/* 响应式调整 */
@media (max-width: 840px) {
  .calculator-container {
    padding: 1rem;
  }

  .calculator {
    padding: 2rem;
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
</style>
