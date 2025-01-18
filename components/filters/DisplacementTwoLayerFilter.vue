<script setup lang="ts">
  defineProps<{
    id: string,
  }>()
</script>

<template>
  <!-- Complex Op Art filter -->
    <filter :id="id">
    <!-- First turbulence layer - creates larger movement -->
    <feTurbulence
        type="fractalnoise"
        baseFrequency="0.015 0.005"
        numOctaves="1"
        seed="1"
        result="noise1">
      <animate
          attributeName="baseFrequency"
          dur="20s"
          values="0.015 0.005;0.005 0.015;0.015 0.005"
          repeatCount="indefinite"/>
    </feTurbulence>

    <!-- Second turbulence layer - creates finer detail -->
    <feTurbulence
        type="fractalnoise"
        baseFrequency="0.04 0.02"
        numOctaves="2"
        seed="2"
        result="noise2">
      <animate
          attributeName="baseFrequency"
          dur="25s"
          values="0.04 0.02;0.02 0.04;0.04 0.02"
          repeatCount="indefinite"/>
    </feTurbulence>

    <!-- Combine the two noise patterns -->
    <feComposite
        in="noise1"
        in2="noise2"
        operator="arithmetic"
        k1="0.5"
        k2="0.5"
        k3="0"
        k4="0"
        result="combinedNoise"/>

    <!-- Create contrast in the noise -->
    <feColorMatrix
        in="combinedNoise"
        type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 5 -1"
        result="highContrast"/>

    <!-- Apply the displacement -->
    <feDisplacementMap
        in="SourceGraphic"
        in2="highContrast"
        scale="15"
        xChannelSelector="R"
        yChannelSelector="G"/>
  </filter>

</template>

<style scoped>

</style>