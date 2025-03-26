<script setup lang="ts">
import { useCalculatorStore } from '@/stores/calculator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const store = useCalculatorStore()

/**
 * 添加一个新数字到配置中
 */
const addNumber = () => {
  store.numbers.push({ value: 1, maxCount: 999999 })
}

/**
 * 删除指定索引的数字
 * @param index 要删除的数字索引
 */
const removeNumber = (index: number) => {
  if (store.numbers.length > 1) {
    store.numbers.splice(index, 1)
  } else {
    alert('至少需要保留一个数字！')
  }
}

/**
 * 导入批量编辑的数字
 */
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

/**
 * 导出数字到批量编辑模式
 */
const exportNumbers = () => {
  store.tempNumbers = store.numbers.map((n) => `${n.value},${n.maxCount}`).join('\n')
  store.isEditing = true
}

/**
 * 重置计算器的所有配置
 */
const resetCalculator = () => {
  if (confirm('确定要重置所有数据吗？')) {
    store.$reset()
  }
}
</script>

<template>
  <Card class="mb-8 border shadow-sm">
    <CardHeader>
      <div class="flex flex-wrap justify-between items-center">
        <CardTitle class="text-2xl font-semibold mb-2 sm:mb-0">配置参数</CardTitle>
        <div class="space-x-2 flex">
          <Button v-if="!store.isEditing" @click="exportNumbers" variant="secondary" size="sm">
            批量编辑
          </Button>
          <Button @click="resetCalculator" variant="outline" size="sm"> 重置 </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <!-- 批量编辑模式 -->
      <div v-if="store.isEditing" class="mb-4">
        <div class="mb-3 text-sm text-muted-foreground">
          每行输入一个数字配置，格式：数字,最大次数（最大次数可选，默认999999）
        </div>
        <textarea
          v-model="store.tempNumbers"
          class="w-full h-40 p-3 border rounded-lg bg-background border-input text-foreground focus:ring-2 focus:ring-ring focus:border-input transition-all duration-300 text-sm"
          placeholder="例如：
998,3
358
258
198"
        ></textarea>
        <div class="flex justify-end space-x-3 mt-3">
          <Button
            @click="((store.isEditing = false), (store.tempNumbers = ''))"
            variant="outline"
            size="sm"
          >
            取消
          </Button>
          <Button @click="importNumbers" variant="default" size="sm"> 保存 </Button>
        </div>
      </div>

      <!-- 常规编辑模式 -->
      <div v-else class="space-y-6">
        <div class="overflow-x-auto -mx-4 sm:mx-0 rounded-lg border">
          <div class="inline-block min-w-full align-middle">
            <table class="min-w-full divide-y divide-border">
              <thead class="bg-muted/50">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    数字值
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    最大使用次数
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-card divide-y divide-border">
                <tr
                  v-for="(number, index) in store.numbers"
                  :key="index"
                  class="hover:bg-muted/20 transition-colors"
                >
                  <td class="px-4 py-3 whitespace-nowrap">
                    <Input
                      type="number"
                      v-model.number="number.value"
                      placeholder="数字值"
                      min="1"
                      class="w-full sm:w-32 text-sm transition-all focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <Input
                      type="number"
                      v-model.number="number.maxCount"
                      placeholder="最大次数"
                      min="0"
                      class="w-full sm:w-32 text-sm transition-all focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <Button
                      @click="removeNumber(index)"
                      variant="destructive"
                      size="sm"
                      class="w-full sm:w-auto transition-all duration-200 hover:shadow-md"
                    >
                      删除
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Button
          @click="addNumber"
          variant="secondary"
          class="w-full hover:bg-secondary/90 transition-all duration-200"
        >
          添加新数字
        </Button>

        <!-- 修改目标值和优先数字选择表格 -->
        <div class="overflow-x-auto -mx-4 sm:mx-0 mt-6 rounded-lg border">
          <div class="inline-block min-w-full align-middle">
            <table class="min-w-full divide-y divide-border">
              <tbody class="bg-card divide-y divide-border">
                <tr class="hover:bg-muted/20 transition-colors">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">
                    目标值：
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <Input
                      type="number"
                      v-model.number="store.target"
                      min="0"
                      class="w-full sm:w-32 text-sm transition-all focus:ring-2 focus:ring-ring focus:border-ring"
                    />
                  </td>
                </tr>
                <tr class="hover:bg-muted/20 transition-colors">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-foreground">
                    优先使用的数字：
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <select
                      v-model.number="store.priorityNumber"
                      class="w-full sm:w-32 p-2 text-sm border rounded-lg border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-input transition-all duration-300"
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
    </CardContent>
  </Card>
</template>

<style scoped>
/* 为输入框添加过渡效果 */
input,
select {
  transition: all 0.2s ease-in-out;
}

input:focus,
select:focus {
  transform: translateY(-1px);
}

/* 增加表格行的视觉分离度 */
tr {
  border-bottom: 1px solid rgba(var(--border), 0.1);
}

table {
  border-collapse: separate;
  border-spacing: 0;
}
</style>
