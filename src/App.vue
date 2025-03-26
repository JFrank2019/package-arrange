<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'
import { RouterView } from 'vue-router'
import { Button } from '@/components/ui/button'

const { isDarkMode, toggleDarkMode } = useDarkMode()
</script>

<template>
  <div class="min-h-screen bg-background transition-colors duration-300 font-sans antialiased">
    <header
      class="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg shadow-md border-b header-border"
      :class="isDarkMode ? 'bg-gray-800/90 dark-nav' : 'bg-white/95'"
    >
      <div class="container mx-auto px-6 h-16 flex items-center justify-between">
        <div class="text-xl font-display font-semibold text-foreground">Package Arrangement</div>
        <Button
          @click="toggleDarkMode"
          variant="outline"
          size="icon"
          class="rounded-full hover:bg-secondary transition-colors duration-200"
          :aria-label="isDarkMode ? '切换到亮色模式' : '切换到暗色模式'"
        >
          <svg
            v-if="!isDarkMode"
            class="w-5 h-5 text-apple-accent-yellow"
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
            class="w-5 h-5 text-primary"
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
        </Button>
      </div>
    </header>

    <main class="flex justify-center pt-24 pb-16 px-4">
      <div class="w-full max-w-7xl">
        <RouterView v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
            appear
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
          >
            <component :is="Component" />
          </transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  width: 100%;
  max-width: 1200px;
}

.dark-nav {
  border-bottom-color: rgba(59, 130, 246, 0.3) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
}

.header-border {
  border-color: rgba(var(--border), 0.5);
}

.dark .dark-nav {
  background-color: rgba(30, 41, 59, 0.95) !important;
}
</style>
