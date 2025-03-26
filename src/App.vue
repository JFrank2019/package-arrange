<script setup lang="ts">
import { useDarkMode } from '@/composables/useDarkMode'
import { RouterView } from 'vue-router'
import { Button } from '@/components/ui/button'

const { isDarkMode, toggleDarkMode } = useDarkMode()
</script>

<template>
  <div
    class="min-h-screen bg-background transition-colors duration-300 font-sans antialiased overflow-hidden"
  >
    <header
      class="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40"
    >
      <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="text-xl font-display font-semibold text-foreground">Package Arrangement</div>
        <Button
          @click="toggleDarkMode"
          variant="ghost"
          size="icon"
          class="rounded-full hover:bg-secondary"
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
            class="w-5 h-5 text-apple-accent-cyan"
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

    <main class="container mx-auto px-4 pt-24 pb-16">
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
}
</style>
