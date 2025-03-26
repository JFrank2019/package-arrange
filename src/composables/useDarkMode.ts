import { ref, onMounted } from 'vue'

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

  return {
    isDarkMode,
    toggleDarkMode,
  }
}
