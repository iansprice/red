<template>
  <button
      @click="triggerPress"
      :class="[
      // Base styles
      'relative px-6 py-3 text-lg font-semibold text-white',
      'bg-blue-500 shadow-lg',
      'transition-all duration-200 transform',

      // Pseudo-element base styles
      'before:absolute before:inset-0 before:bg-black/5',
      'before:transition-all before:duration-200',

      // Hover styles
      'hover:scale-105 hover:-skew-x-0 hover:shadow-xl hover:before:bg-black/0',

        // Dynamic pressed state
      isPressed ? 'translate-y-[1px] skew-x-0 shadow-md before:bg-black/10' : 'translate-y-0 skew-x-0 before:bg-black/5'
    ]"
  >
    <slot>Click Me</slot>
  </button>
</template>

<script setup>
import { ref } from 'vue'

const isPressed = ref(false)

const triggerPress = () => {
  isPressed.value = true
  setTimeout(() => {
    isPressed.value = false
  }, 250)
}
</script>