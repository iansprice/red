<!-- ThemeToggle.vue -->
<template>
  <button
      @click="toggleTheme"
      class="relative w-12 h-12 rounded-full
           overflow-hidden"
      :disabled="isAnimating"
      aria-label="Toggle theme"
  >
    <!-- Sun -->
    <div
        class="absolute w-5 h-5"
        :class="{ 'sun-set': isAnimating && willBeDark, 'sun-rise': isAnimating && !willBeDark }"
        :style="{
        left: '14px',
        top: '14px',
        opacity: isDark ? 0 : 1,
        transition: isAnimating ? 'none' : 'all 0s'
      }"
    >
      <div class="w-full h-full rounded-full bg-yellow-400" />
    </div>

    <!-- Moon -->
    <div
        class="absolute w-5 h-5"
        :class="{ 'moon-set': isAnimating && !willBeDark, 'moon-rise': isAnimating && willBeDark }"
        :style="{
        left: '14px',
        top: '14px',
        opacity: isDark ? 1 : 0,
        transition: isAnimating ? 'none' : 'all 0s'
      }"
    >
      <div class="w-full h-full rounded-full bg-gray-100 overflow-hidden">
        <div
            class="absolute w-full h-full rounded-full bg-blue-950
                 -right-1.5 -top-0.5"
        />
      </div>
    </div>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const isAnimating = ref(false)
const willBeDark = ref(false)

const toggleTheme = () => {
  if (isAnimating.value) return
  isAnimating.value = true
  willBeDark.value = !isDark.value

  // Add transition class to document
  document.documentElement.classList.add('theme-transitioning')

  // Switch theme at midpoint
  setTimeout(() => {
    toggleDark()
  }, 1250)

  // Remove transition class and reset animation state
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transitioning')
    isAnimating.value = false
  }, 2500)
}
</script>

<style scoped>
@keyframes sun-set {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(48px, 48px);
    opacity: 0;
  }
}

@keyframes sun-rise {
  0% {
    transform: translate(-48px, -48px);
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}

@keyframes moon-set {
  0% {
    transform: translate(0, 0);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(-48px, 48px);
    opacity: 0;
  }
}

@keyframes moon-rise {
  0% {
    transform: translate(48px, -48px);
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    transform: translate(0, 0);
    opacity: 1;
  }
}

.sun-set {
  animation: sun-set 700ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
}

.sun-rise {
  animation: sun-rise 700ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
}

.moon-set {
  animation: moon-set 700ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
}

.moon-rise {
  animation: moon-rise 700ms cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
}
</style>