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

// 用户交互状态
const userInteracted = ref(false)

// 计算方法
const calculate = async () => {
  if (store.isCalculating) return

  try {
    store.validateInput()
    await store.calculateResult()

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
    <Card class="calculator apple-shadow">
      <div class="max-w-4xl mx-auto space-y-8">
        <h1 class="text-4xl font-bold text-center mb-8 text-foreground font-display tracking-tight">
          数字组合计算器
        </h1>

        <CalculatorConfig />

        <Card class="space-y-5 p-6 border shadow-sm bg-card/50">
          <ErrorDisplay
            :errors="store.errors"
            :show="store.errors.length > 0 && userInteracted"
            :calculating="store.isCalculating"
          />

          <div class="transition-all duration-300">
            <Button
              @click="calculate"
              :disabled="store.isCalculating || store.errors.length > 0"
              variant="default"
              size="lg"
              class="w-full text-lg font-medium group relative overflow-hidden"
            >
              <span
                class="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary transition-opacity duration-300"
                :class="{ 'opacity-0': !store.isCalculating, 'opacity-100': store.isCalculating }"
              ></span>
              <span
                v-if="store.isCalculating"
                class="flex items-center justify-center relative z-10"
              >
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
              <span v-else class="relative z-10">开始计算</span>
            </Button>
          </div>
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
            :calculating="store.isCalculating"
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
  border: 1px solid rgba(var(--border), 0.2);
  background-color: hsl(var(--card));
  color: hsl(var(--card-foreground));
  position: relative;
  border-radius: var(--radius);
  overflow: hidden;
}

.calculator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.7));
  z-index: 1;
}

/* 暗色模式增强 */
:global(.dark) .calculator {
  border-color: rgba(59, 130, 246, 0.15);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.35),
    0 0 15px rgba(59, 130, 246, 0.1);
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
    padding: 0.5rem;
  }

  .calculator {
    margin: 0;
    padding: 1.5rem 1rem;
    border-radius: var(--radius);
  }

  h1 {
    font-size: 1.75rem;
    margin-bottom: 1rem !important;
  }
}
</style>
