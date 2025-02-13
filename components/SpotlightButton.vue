<template>
  <NuxtLink :to="to" class=" group">
    <button
        class="no-underline relative overflow-hidden rounded-lg hover:bg-white/03 text-white hover:shadow-2xl border border-primary/10 hover:border-transparent scale-110 hover:scale-105 transition-all duration-250 py-4 px-6"
        @mousemove="handleMouseMove"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
    >
      <span
          class="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
          :style="spotlightStyle"
      />
      <span class="relative z-10 text-lg font-medium text-amber-400">
        <slot name="default"/>
      </span>
    </button>
  </NuxtLink>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import RainbowButton from "./RainbowButton.vue";
import AuroraBackground from "./AuroraBackground.vue";

defineProps<{to?: any, class?: string}>()

const mousePosition = ref({ x: 0, y: 0 })
const isHovered = ref(false)

const handleMouseMove = (e) => {
  const button = e.currentTarget
  const rect = button.getBoundingClientRect()

  mousePosition.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

const spotlightStyle = computed(() => ({
  opacity: isHovered.value ? 0.25 : 0,
  background: `radial-gradient(200px circle at ${mousePosition.value.x}px ${mousePosition.value.y}px, rgba(255,255,255,0.6), transparent 70%)`,
}))
</script>