<script setup lang="ts">
import { useCalculatorStore } from '@/stores/calculator'

const store = useCalculatorStore()

const addNumber = () => {
  store.numbers.push({ value: 1, maxCount: 999999 })
}

const removeNumber = (index: number) => {
  if (store.numbers.length > 1) {
    store.numbers.splice(index, 1)
  } else {
    alert('至少需要保留一个数字！')
  }
}

const importNumbers = () => {
  try {
    const numbers = store.tempNumbers
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)
      .map((line) => {
        const [value, maxCount] = line.split(',').map((n) => parseInt(n.trim()))
        return { value, maxCount: maxCount || 999999 }
      })

    if (numbers.length === 0) throw new Error('没有有效的数字')

    // 验证导入的数字
    const errors: string[] = []
    const seen = new Set()
    numbers.forEach(({ value, maxCount }) => {
      if (seen.has(value)) errors.push(`数字 ${value} 重复`)
      seen.add(value)
      if (value <= 1) errors.push(`数字 ${value} 必须大于1`)
      if (maxCount <= 0) errors.push(`数字 ${value} 的最大次数必须大于0`)
    })

    if (errors.length > 0) throw new Error(errors.join('\n'))

    store.numbers = numbers
    store.isEditing = false
    store.tempNumbers = ''
  } catch (error) {
    if (error instanceof Error) {
      store.setErrors(error.message.split('\n'))
    }
  }
}

const exportNumbers = () => {
  store.tempNumbers = store.numbers.map((n) => `${n.value},${n.maxCount}`).join('\n')
  store.isEditing = true
}

const resetCalculator = () => {
  if (confirm('确定要重置所有数据吗？')) {
    store.$reset()
  }
}
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 transform transition-all duration-300"
  >
    <div class="flex flex-wrap justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2 sm:mb-0">配置参数</h2>
      <div class="space-x-2 flex">
        <button
          v-if="!store.isEditing"
          @click="exportNumbers"
          class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5"
        >
          批量编辑
        </button>
        <button
          @click="resetCalculator"
          class="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5"
        >
          重置
        </button>
      </div>
    </div>

    <!-- 批量编辑模式 -->
    <div v-if="store.isEditing" class="mb-4">
      <div class="mb-3 text-sm text-gray-600 dark:text-gray-400">
        每行输入一个数字配置，格式：数字,最大次数（最大次数可选，默认999999）
      </div>
      <textarea
        v-model="store.tempNumbers"
        class="w-full h-40 p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        placeholder="例如：
998,3
358
258
198"
      ></textarea>
      <div class="flex justify-end space-x-3 mt-3">
        <button
          @click="((store.isEditing = false), (store.tempNumbers = ''))"
          class="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5"
        >
          取消
        </button>
        <button
          @click="importNumbers"
          class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5"
        >
          保存
        </button>
      </div>
    </div>

    <!-- 常规编辑模式 -->
    <div v-else class="space-y-6">
      <div class="overflow-x-auto -mx-4 sm:mx-0">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  数字值
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  最大使用次数
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="(number, index) in store.numbers"
                :key="index"
                class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td class="px-4 py-3 whitespace-nowrap">
                  <input
                    type="number"
                    v-model.number="number.value"
                    placeholder="数字值"
                    min="1"
                    class="w-full sm:w-32 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-300"
                  />
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <input
                    type="number"
                    v-model.number="number.maxCount"
                    placeholder="最大次数"
                    min="0"
                    class="w-full sm:w-32 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-300"
                  />
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <button
                    @click="removeNumber(index)"
                    class="w-full sm:w-auto px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    删除
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button
        @click="addNumber"
        class="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow hover:shadow-md transform hover:-translate-y-0.5 text-sm font-medium"
      >
        添加新数字
      </button>

      <!-- 修改目标值和优先数字选择表格 -->
      <div class="overflow-x-auto -mx-4 sm:mx-0 mt-6">
        <div class="inline-block min-w-full align-middle">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  目标值：
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <input
                    type="number"
                    v-model.number="store.target"
                    min="0"
                    class="w-full sm:w-32 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-300"
                  />
                </td>
              </tr>
              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  优先使用的数字：
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <select
                    v-model.number="store.priorityNumber"
                    class="w-full sm:w-32 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-300"
                  >
                    <option v-for="num in store.numbers" :key="num.value" :value="num.value">
                      {{ num.value }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
