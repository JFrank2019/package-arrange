<script setup lang="ts">
defineProps<{
  errors: string[]
  show: boolean
  calculating: boolean
}>()
</script>

<template>
  <div
    v-if="show"
    class="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded transform transition-all duration-300 error-shake"
    :class="calculating ? 'scale-105 shadow-lg' : ''"
  >
    <div class="flex items-start">
      <svg class="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div>
        <p class="font-bold mb-2">请检查以下错误：</p>
        <ul class="list-disc pl-5 space-y-1">
          <li
            v-for="(error, index) in errors"
            :key="index"
            class="transform transition-all duration-300 hover:translate-x-1"
          >
            {{ error }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.error-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
