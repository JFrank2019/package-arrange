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
    class="bg-destructive/10 border-l-4 border-destructive text-destructive p-5 rounded-lg transform transition-all duration-300 error-container"
    :class="calculating ? 'scale-105 shadow-lg' : ''"
  >
    <div class="flex items-start">
      <svg
        class="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 animate-pulse"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <div class="flex-1">
        <p class="font-semibold mb-3 font-display">请检查以下错误：</p>
        <ul class="space-y-2 text-sm">
          <li
            v-for="(error, index) in errors"
            :key="index"
            class="error-item flex items-start py-1.5 px-2 rounded-md hover:bg-destructive/15 transition-colors duration-200"
          >
            <span class="error-bullet mr-2 font-bold">•</span>
            <span>{{ error }}</span>
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
  20% {
    transform: translateX(-5px);
  }
  40% {
    transform: translateX(5px);
  }
  60% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(3px);
  }
}

.error-container {
  animation: shake 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
  box-shadow: 0 4px 12px rgba(var(--destructive), 0.15);
}

.error-bullet {
  color: hsl(var(--destructive));
}

.error-item {
  border-left: 1px solid rgba(var(--destructive), 0.3);
}

.error-item:hover .error-bullet {
  transform: scale(1.2);
  transition: transform 0.2s ease;
}
</style>
