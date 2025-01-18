<script setup lang="ts">
defineProps<{
  id: string,
  scale: number,
}>()
</script>

<template>
  <filter :id="id">
    <!-- Create noise texture for displacement -->
    <feTurbulence
        type="turbulence"
        baseFrequency="0.1"
        numOctaves=".0001"
        result="turbulence">
      <animate
          attributeName="baseFrequency"
          dur="3000s"
          values="0.01;1.0;100.0"
          repeatCount="indefinite"/>
    </feTurbulence>

    Apply displacement using the noise
    <feDisplacementMap
        in="SourceGraphic"
        in2="turbulence"
        :scale="scale"
        xChannelSelector="R"
        yChannelSelector="G"/>
  </filter>
</template>

<style scoped>

</style>