<template>
  <div
      class="min-h-screen transition-colors duration-300 font-sans text-black dark:text-white bg-gradient-to-bl from-zinc-600 to-sky-600 dark:bg-gradient-to-bl dark:from-zinc-900 dark:to-sky-900"
  >
    <transition name="zoom">
      <NuxtLink class="flex flex-col justify-center items-center" v-if="$route.name !== 'index'" :to="{name:'~'}">
        <svg width="460" height="40">
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
                  class="animate-[fade-in_0.25s_ease-in_forwards_0.2s]"
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
    <NuxtPage/>
  </div>
</template>

<script setup>
import DisplacementCircles from "../components/filters/DisplacementCircles.vue";
</script>

<style>
</style>