import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

interface NumberConfig {
  value: number
  maxCount: number
}

interface CalculationResult {
  sum: number
  priorityCount: number
  combination: Record<number, number>
}

const DEFAULT_CONFIG = {
  numbers: [
    { value: 998, maxCount: 3 },
    { value: 358, maxCount: 999999 },
    { value: 258, maxCount: 999999 },
    { value: 198, maxCount: 999999 },
  ],
  target: 0,
  priorityNumber: 358,
}

interface DebounceOptions {
  immediate?: boolean
}

function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
  options: DebounceOptions = {},
) {
  let timer: NodeJS.Timeout | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    if (options.immediate && !timer) {
      fn.apply(this, args)
    }

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      if (!options.immediate) {
        fn.apply(this, args)
      }
      timer = null
    }, delay)
  }
}

export const useCalculatorStore = defineStore('calculator', () => {
  // 状态
  const numbers = ref<NumberConfig[]>([
    { value: 998, maxCount: 3 },
    { value: 358, maxCount: 999999 },
    { value: 258, maxCount: 999999 },
    { value: 198, maxCount: 999999 },
  ])
  const target = ref(0)
  const priorityNumber = ref(358)
  const result = ref<CalculationResult | null>(null)
  const calculatedTarget = ref<number | null>(null)
  const errors = ref<string[]>([])
  const isEditing = ref(false)
  const tempNumbers = ref('')

  // 计算属性
  const isValidConfig = computed(() => !numbers.value.some((num) => num.value <= 1))
  const availableNumbers = computed(() => numbers.value.map((n) => n.value))
  const sortedCombination = computed(() => {
    if (!result.value) return []
    return Object.entries(result.value.combination)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
  })

  // 方法
  const validateInput = () => {
    const newErrors: string[] = []

    if (!isValidConfig.value) {
      newErrors.push('配置参数必须大于1')
    }
    // ... 其他验证逻辑 ...

    if (newErrors.length > 0) {
      throw new Error(newErrors.join('\n'))
    }
  }

  // 添加方法
  const resetResult = () => {
    result.value = null
    calculatedTarget.value = null
  }

  const setErrors = (newErrors: string[]) => {
    errors.value = newErrors
  }

  const validateInputRealTime = () => {
    const newErrors: string[] = []

    if (target.value < 0) {
      newErrors.push('目标值不能为负数')
    }

    numbers.value.forEach((num, index) => {
      if (num.value <= 1) {
        newErrors.push(`第 ${index + 1} 个数字必须大于1`)
      }
      if (num.maxCount <= 0) {
        newErrors.push(`第 ${index + 1} 个数字的最大使用次数必须大于0`)
      }
    })

    // 检查重复数字
    const numMap = new Map()
    numbers.value.forEach((num, index) => {
      if (numMap.has(num.value)) {
        newErrors.push(
          `数字 ${num.value} 在第 ${numMap.get(num.value) + 1} 和第 ${index + 1} 行重复`,
        )
      }
      numMap.set(num.value, index)
    })

    errors.value = newErrors
  }

  // 计算结果缓存
  const resultCache = new Map()
  const MAX_CACHE_SIZE = 1000

  const cleanCache = () => {
    if (resultCache.size > MAX_CACHE_SIZE) {
      const cacheEntries = Array.from(resultCache.entries())
      const sortedEntries = cacheEntries.sort((a, b) => b[1].lastUsed - a[1].lastUsed)
      const entriesToDelete = sortedEntries.slice(MAX_CACHE_SIZE / 2)
      entriesToDelete.forEach(([key]) => resultCache.delete(key))
    }
  }

  const findOptimalSum = (
    targetValue: number,
    config: { numbers: NumberConfig[]; priorityNumber: number },
  ) => {
    // 初始化结果对象
    const calcResult: CalculationResult = {
      sum: 0,
      priorityCount: 0,
      combination: {},
    }

    config.numbers.forEach((num) => {
      calcResult.combination[num.value] = 0
    })

    // 创建 DP 数组
    const dp = Array.from({ length: targetValue + 1 }, () => ({
      possible: false,
      priorityCount: 0,
      combination: {} as Record<number, number>,
    }))

    // 初始化起点
    dp[0] = {
      possible: true,
      priorityCount: 0,
      combination: Object.fromEntries(config.numbers.map((num) => [num.value, 0])),
    }

    // 对每个金额进行计算
    for (let i = 0; i <= targetValue; i++) {
      if (!dp[i].possible) continue

      // 尝试每个数字
      for (const num of config.numbers) {
        const value = num.value
        const maxCount = num.maxCount

        // 检查当前组合中该数字的使用次数
        const currentCount = dp[i].combination[value]

        // 如果未达到最大使用次数且金额足够，可以继续使用该数字
        if (currentCount < maxCount && i + value <= targetValue) {
          const newAmount = i + value
          const newPriorityCount = dp[i].priorityCount + (value === config.priorityNumber ? 1 : 0)

          // 更新条件
          if (!dp[newAmount].possible || newPriorityCount > dp[newAmount].priorityCount) {
            const newCombination = { ...dp[i].combination }
            newCombination[value]++

            dp[newAmount] = {
              possible: true,
              priorityCount: newPriorityCount,
              combination: newCombination,
            }
          }
        }
      }
    }

    // 从目标值向下找到最接近的可能解
    for (let i = targetValue; i >= 0; i--) {
      if (dp[i].possible) {
        calcResult.sum = i
        calcResult.priorityCount = dp[i].priorityCount
        calcResult.combination = dp[i].combination
        break
      }
    }

    return calcResult
  }

  const calculateResult = async () => {
    const cacheKey = `${target.value}-${numbers.value.map((n) => `${n.value},${n.maxCount}`).join(';')}-${priorityNumber.value}`

    if (resultCache.has(cacheKey)) {
      const cachedResult = resultCache.get(cacheKey)
      cachedResult.lastUsed = Date.now()
      return JSON.parse(JSON.stringify(cachedResult.result))
    }

    const config = {
      numbers: numbers.value,
      priorityNumber: priorityNumber.value,
    }

    result.value = findOptimalSum(target.value, config)
    calculatedTarget.value = target.value

    cleanCache()
    resultCache.set(cacheKey, {
      result: JSON.parse(JSON.stringify(result.value)),
      lastUsed: Date.now(),
    })

    return result.value
  }

  const $reset = () => {
    numbers.value = [...DEFAULT_CONFIG.numbers]
    target.value = DEFAULT_CONFIG.target
    priorityNumber.value = DEFAULT_CONFIG.priorityNumber
    result.value = null
    calculatedTarget.value = null
    errors.value = []
    isEditing.value = false
    tempNumbers.value = ''
    localStorage.removeItem('calculatorState')
  }

  // 添加本地存储功能
  const saveStateToLocalStorage = () => {
    const dataToSave = {
      numbers: numbers.value,
      target: target.value,
      priorityNumber: priorityNumber.value,
    }
    localStorage.setItem('calculatorState', JSON.stringify(dataToSave))
  }

  const loadStateFromLocalStorage = () => {
    const savedState = localStorage.getItem('calculatorState')
    if (savedState) {
      const parsedState = JSON.parse(savedState)
      numbers.value = parsedState.numbers
      target.value = parsedState.target
      priorityNumber.value = parsedState.priorityNumber
    }
  }

  // 添加防抖计算
  const debouncedCalculate = debounce(async () => {
    if (errors.value.length === 0) {
      await calculateResult()
    }
  }, 500)

  // 监听输入变化
  watch(
    () => ({
      numbers: [...numbers.value],
      target: target.value,
      priorityNumber: priorityNumber.value,
    }),
    () => {
      validateInputRealTime()
      // 移除自动计算，只在输入改变时验证输入
    },
    { deep: true },
  )

  return {
    numbers,
    target,
    priorityNumber,
    result,
    calculatedTarget,
    errors,
    isEditing,
    tempNumbers,
    isValidConfig,
    availableNumbers,
    sortedCombination,
    validateInput,
    resetResult,
    setErrors,
    validateInputRealTime,
    calculateResult,
    $reset,
    loadStateFromLocalStorage,
    saveStateToLocalStorage,
    debouncedCalculate,
  }
})
