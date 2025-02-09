<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'
import { RouterView } from 'vue-router'

const { isDarkMode, toggleDarkMode } = useDarkMode()
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300 flex items-center justify-center"
  >
    <div class="w-full">
      <button
        @click="toggleDarkMode"
        class="fixed top-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl z-50 backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80"
        :title="isDarkMode ? '切换到亮色模式' : '切换到暗色模式'"
      >
        <svg
          v-if="!isDarkMode"
          class="w-5 h-5 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </button>

      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in" appear>
          <component :is="Component" />
        </transition>
      </RouterView>
    </div>
  </div>
</template>

<style>
:root {
  --bg-primary: rgb(249, 250, 251);
  --bg-secondary: rgb(255, 255, 255);
  --text-primary: rgb(17, 24, 39);
  --text-secondary: rgb(107, 114, 128);
}

:root.dark {
  --bg-primary: rgb(17, 24, 39);
  --bg-secondary: rgb(31, 41, 55);
  --text-primary: rgb(243, 244, 246);
  --text-secondary: rgb(156, 163, 175);
}

#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: var(--text-primary);
  background-color: var(--bg-primary);
}

.min-h-screen {
  transition: all 0.3s ease;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 主题切换过渡效果 */
*,
*::before,
*::after {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
