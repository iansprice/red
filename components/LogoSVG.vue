<script setup>
import DisplacementCircles from "./filters/DisplacementCircles.vue";
</script>

<template>
  <transition name="zoom">
    <NuxtLink
        class="z-50 pointer-events-auto flex flex-col justify-center items-center scale-75 md:scale-100 hover:backdrop-saturate-110 hover:brightness-75"
        :to="{name:'~'}"
        style="z-index: 50; pointer-events: auto; isolation: isolate; position: relative;"
    >
      <svg class="w-full max-w-[460px]" viewBox="0 0 460 40">
        <defs>
          <DisplacementCircles id="dis1"/>
          <animate
              attributeName="stroke-width"
              values="0;3.5"
              dur="1.5s"
              repeatCount="0"
          />
          <animate
              attributeName="stroke-opacity"
              values="0;1"
              dur="1s"
              repeatCount="0"
          />
        </defs>
        <g filter="url(#dis1)">
          <text x="0vw" y="28"
                class="animate-[fade-in_0.25s_ease-in_forwards_0.5s]"
                text-anchor="start"
                dominant-baseline="middle"
                font-family="Arial Black, Arial, sans-serif"
                font-weight="900"
                font-size="30px"
                fill="#db4740">
            RED MOUNTAIN SOFTWARE
          </text>
        </g>
      </svg>
    </NuxtLink>
  </transition>
</template>

<style scoped>

</style>