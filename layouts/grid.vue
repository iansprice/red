<script setup>

import InteractiveGridPattern from "../components/ui/InteractiveGridPattern.vue";

const squares1 = ref(24)
const squares2 = ref(24)

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

useIntervalFn(() => {
  const screenWSquares = Math.ceil(screen.width / 40)
  squares1.value = getRandomInt(4, screenWSquares)
  const screenHSquares = Math.ceil(screen.height / 40)
  squares2.value = getRandomInt(4, screenHSquares)
}, 2500)

const squares = computed(() => [squares1.value, squares2.value])
</script>

<template>
  <div class="grid place-content-center overflow-hidden z-10">
    <div
        class="absolute top-0 left-0 z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter bg-transparent"
    >
      <slot/>
    </div>
    <div class="absolute -top-48 h-[100vh] w-[120vw]">
    <InteractiveGridPattern
          class="inset-0 h-[150vh] w-[120vw] animate-move-left -left-[40px] scale-125 bg-blue-900 z-1"
          :width="40"
          :height="40"
          squares-class-name="hover:fill-red-800"
          :squares="squares"
      />
    </div>

  </div>
</template>

<style scoped>

</style>