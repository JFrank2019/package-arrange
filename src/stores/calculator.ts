import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

/**
 * 数字配置接口
 * @interface NumberConfig
 * @property {number} value - 数字的值
 * @property {number} maxCount - 数字的最大使用次数
 */
interface NumberConfig {
  value: number
  maxCount: number
}

/**
 * 计算结果接口
 * @interface CalculationResult
 * @property {number} sum - 计算得到的总和
 * @property {number} priorityCount - 优先数字使用的次数
 * @property {Record<number, number>} combination - 数字使用的次数映射
 */
interface CalculationResult {
  sum: number
  priorityCount: number
  combination: Record<number, number>
}

/**
 * 缓存项接口
 * @interface CacheItem
 * @property {CalculationResult} result - 计算结果
 * @property {number} lastUsed - 最后使用时间戳
 * @property {number} expiry - 过期时间戳
 */
interface CacheItem {
  result: CalculationResult
  lastUsed: number
  expiry: number
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

// 缓存相关常量
const MAX_CACHE_SIZE = 1000
const CACHE_EXPIRY = 24 * 60 * 60 * 1000 // 24小时过期

/**
 * 防抖函数接口
 * @interface DebounceOptions
 * @property {boolean} [immediate] - 是否立即执行
 */
interface DebounceOptions {
  immediate?: boolean
}

/**
 * 防抖函数
 * @param fn 需要防抖的函数
 * @param delay 延迟时间(ms)
 * @param options 配置选项
 * @returns 防抖后的函数
 */
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
  const isCalculating = ref(false)

  // 计算属性
  const isValidConfig = computed(() => !numbers.value.some((num) => num.value <= 1))
  const availableNumbers = computed(() => numbers.value.map((n) => n.value))
  const sortedCombination = computed(() => {
    if (!result.value) return []
    return Object.entries(result.value.combination)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
  })

  /**
   * 验证输入参数
   * @throws {Error} 如果参数无效则抛出错误
   */
  const validateInput = () => {
    const newErrors: string[] = []

    if (target.value < 0) {
      newErrors.push('目标值不能为负数')
    }

    if (!isValidConfig.value) {
      newErrors.push('数字配置参数必须大于1')
    }

    // 检查数字范围和最大使用次数
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

    if (newErrors.length > 0) {
      throw new Error(newErrors.join('\n'))
    }
  }

  /**
   * 重置计算结果
   */
  const resetResult = () => {
    result.value = null
    calculatedTarget.value = null
  }

  /**
   * 设置错误信息
   * @param newErrors 错误信息数组
   */
  const setErrors = (newErrors: string[]) => {
    errors.value = newErrors
  }

  /**
   * 实时验证输入参数
   */
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
  const resultCache = new Map<string, CacheItem>()

  /**
   * 清理过期和超量的缓存
   */
  const cleanCache = () => {
    const now = Date.now()

    // 清理过期缓存
    for (const [key, value] of resultCache.entries()) {
      if (value.expiry < now) {
        resultCache.delete(key)
      }
    }

    // 如果缓存仍然过大，则清理最久未使用的项
    if (resultCache.size > MAX_CACHE_SIZE) {
      const cacheEntries = Array.from(resultCache.entries())
      const sortedEntries = cacheEntries.sort((a, b) => b[1].lastUsed - a[1].lastUsed)
      const entriesToDelete = sortedEntries.slice(MAX_CACHE_SIZE / 2)
      entriesToDelete.forEach(([key]) => resultCache.delete(key))
    }
  }

  /**
   * 查找最优和
   * @param targetValue 目标值
   * @param config 配置参数
   * @returns 计算结果
   */
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

    // 优化：排序数字，优先使用较大的数字来减少迭代次数
    const sortedNumbers = [...config.numbers].sort((a, b) => {
      // 优先级数字排在最前面
      if (a.value === config.priorityNumber) return -1
      if (b.value === config.priorityNumber) return 1
      // 其他数字按值从大到小排序
      return b.value - a.value
    })

    // 创建 DP 数组，使用Map减少内存占用
    const dp = new Map<
      number,
      {
        possible: boolean
        priorityCount: number
        combination: Record<number, number>
      }
    >()

    // 初始化起点
    dp.set(0, {
      possible: true,
      priorityCount: 0,
      combination: Object.fromEntries(config.numbers.map((num) => [num.value, 0])),
    })

    // 对每个目标金额进行计算
    for (let i = 0; i <= targetValue; i++) {
      const current = dp.get(i)
      if (!current || !current.possible) continue

      // 尝试每个数字
      for (const num of sortedNumbers) {
        const value = num.value
        const maxCount = num.maxCount

        // 检查当前组合中该数字的使用次数
        const currentCount = current.combination[value]

        // 如果未达到最大使用次数且金额足够，可以继续使用该数字
        if (currentCount < maxCount && i + value <= targetValue) {
          const newAmount = i + value
          const newPriorityCount = current.priorityCount + (value === config.priorityNumber ? 1 : 0)

          const existing = dp.get(newAmount)

          // 更新条件：如果不存在或者新的优先级计数更高
          if (!existing || !existing.possible || newPriorityCount > existing.priorityCount) {
            const newCombination = { ...current.combination }
            newCombination[value]++

            dp.set(newAmount, {
              possible: true,
              priorityCount: newPriorityCount,
              combination: newCombination,
            })
          }
        }
      }
    }

    // 从目标值向下找到最接近的可能解
    for (let i = targetValue; i >= 0; i--) {
      const state = dp.get(i)
      if (state && state.possible) {
        calcResult.sum = i
        calcResult.priorityCount = state.priorityCount
        calcResult.combination =
          state.priorityCount === 0
            ? {} // 如果没有解，返回空组合
            : state.combination
        break
      }
    }

    return calcResult
  }

  /**
   * 计算结果
   * @returns 计算结果或null
   */
  const calculateResult = async () => {
    isCalculating.value = true

    try {
      const cacheKey = `${target.value}-${numbers.value.map((n) => `${n.value},${n.maxCount}`).join(';')}-${priorityNumber.value}`
      const now = Date.now()

      // 检查缓存
      if (resultCache.has(cacheKey)) {
        const cachedResult = resultCache.get(cacheKey)!

        // 检查是否过期
        if (cachedResult.expiry > now) {
          cachedResult.lastUsed = now
          result.value = JSON.parse(JSON.stringify(cachedResult.result))
          calculatedTarget.value = target.value
          return result.value
        } else {
          // 过期了，从缓存中移除
          resultCache.delete(cacheKey)
        }
      }

      const config = {
        numbers: numbers.value,
        priorityNumber: priorityNumber.value,
      }

      result.value = findOptimalSum(target.value, config)
      calculatedTarget.value = target.value

      cleanCache()

      // 将结果存入缓存，设置过期时间
      resultCache.set(cacheKey, {
        result: JSON.parse(JSON.stringify(result.value)),
        lastUsed: now,
        expiry: now + CACHE_EXPIRY,
      })

      return result.value
    } finally {
      isCalculating.value = false
    }
  }

  /**
   * 重置所有状态
   */
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

  /**
   * 保存状态到本地存储
   */
  const saveStateToLocalStorage = () => {
    const dataToSave = {
      numbers: numbers.value,
      target: target.value,
      priorityNumber: priorityNumber.value,
    }
    localStorage.setItem('calculatorState', JSON.stringify(dataToSave))
  }

  /**
   * 从本地存储加载状态
   */
  const loadStateFromLocalStorage = () => {
    const savedState = localStorage.getItem('calculatorState')
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState)
        numbers.value = parsedState.numbers
        target.value = parsedState.target
        priorityNumber.value = parsedState.priorityNumber
      } catch (error) {
        console.error('加载状态失败:', error)
        // 如果加载失败，重置为默认值
        $reset()
      }
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
      // 当输入变化时保存到本地存储
      saveStateToLocalStorage()
    },
    { deep: true },
  )

  // 初始化时尝试从本地存储加载
  loadStateFromLocalStorage()

  return {
    numbers,
    target,
    priorityNumber,
    result,
    calculatedTarget,
    errors,
    isEditing,
    tempNumbers,
    isCalculating,
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
