<template>
  <div
      class="min-h-screen transition-colors duration-300 font-sans text-black dark:text-white bg-gradient-to-bl from-zinc-600 to-sky-600 dark:bg-gradient-to-bl dark:from-zinc-900 dark:to-sky-900"
  >
    <LogoSVG/>
    <slot name="default"/>
  </div>
</template>

<script setup>
import LogoSVG from "../components/LogoSVG.vue";
</script>

<style>
</style>