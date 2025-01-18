<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
    <div
        class="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient"
        style="background-size: 400% 400%; animation: gradient 15s ease infinite;"
    />
    <slot name="default"/>
  </div>
</template>

<style>
@keyframes skewer {
  0% {
    transform: skewY(0deg) skewX(100deg);

  }
  25% {
    transform: skewY(25deg) skewX(20deg);
  }
  75% {
    transform: skewY(-56deg) skewX(-15deg);
  }
  100% {
    transform: skewY(0deg) skewX(100deg);
  }
}
@keyframes gradient {
  0% {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.animate-gradient {
  animation: gradient 30s ease infinite, skewer 40s ease infinite;
}
</style>
<script setup lang="ts">
</script>