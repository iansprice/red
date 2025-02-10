<template>
  <component
      :is="is"
      :class="
      cn(
        'rainbow-button',
        'group relative inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border-0 bg-[length:300%] bg-[height:300%] px-8 py-2 font-medium text-primary-foreground transition-colors [background-clip:padding-box,border-box,border-box] [background-origin:border-box] [border:calc(0.08*1rem)_solid_transparent] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        'before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:bg-[linear-gradient(90deg,var(--color-1),var(--color-5),var(--color-3),var(--color-4),var(--color-2))] before:bg-[length:300%] after:bg-[length:200%] before:[filter:blur(calc(0.8*1rem))]',
        props.class,
      )
    "
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
import { cn } from "../lib/utils";

interface RainbowButtonProps {
  class?: string;
  is?: string;
  speed?: number;
}

const props = withDefaults(defineProps<RainbowButtonProps>(), {
  speed: 5,
  is: "button",
});

const speedInSeconds = computed(() => `${props.speed}s`);
</script>

<style scoped>
.rainbow-button {
  --color-1: hsl(0 100% 63%);
  --color-2: hsl(270 100% 63%);
  --color-3: hsl(210 100% 63%);
  --color-4: hsl(195 100% 63%);
  --color-5: hsl(90 100% 63%);
  --speed: v-bind(speedInSeconds);
  animation: rainbow var(--speed) infinite linear;
}

.rainbow-button:before {
  animation: rainbow var(--speed) infinite linear;
}

.rainbow-button:after {
  animation: rainbow var(--speed) infinite linear;
}
@keyframes rainbow {
  0% {
    background-position: 0;
  }
  100% {
    background-position: 300%;
  }
}
</style>