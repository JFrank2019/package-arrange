import { ref, onMounted, watch } from 'vue'

export function useDarkMode() {
  const isDarkMode = ref(false)

  const updateDarkMode = (dark: boolean) => {
    document.documentElement.classList.toggle('dark', dark)
    isDarkMode.value = dark
    localStorage.setItem('darkMode', dark ? 'true' : 'false')
  }

  const toggleDarkMode = () => {
    updateDarkMode(!isDarkMode.value)
  }

  onMounted(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      updateDarkMode(savedMode === 'true')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      updateDarkMode(prefersDark)
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem('darkMode') === null) {
        updateDarkMode(e.matches)
      }
    })
  })

  const lightTheme = {
    '--bg-primary': '#ffffff',
    '--bg-secondary': '#f5f5f5',
    '--bg-tertiary': '#e0e0e0',
    '--bg-hover': '#d5d5d5',
    '--text-primary': '#333333',
  }

  const darkTheme = {
    '--bg-primary': '#1a1a1a',
    '--bg-secondary': '#2d2d2d',
    '--bg-tertiary': '#404040',
    '--bg-hover': '#505050',
    '--text-primary': '#ffffff',
  }

  return {
    isDarkMode,
    toggleDarkMode,
  }
}
