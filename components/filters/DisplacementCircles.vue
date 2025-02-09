<script setup lang="ts">
  defineProps<{
    id: string
  }>()
</script>

<template>
  <filter :id="id">
    <!-- First layer - larger circles -->
    <feTurbulence
        type="fractalNoise"
        baseFrequency="0.0025 0.0025"
        numOctaves="1"
        seed="1"
        result="noise1">
      <animate
          attributeName="baseFrequency"
          values="0.0001 0.0025;0.0004 0.0003"
          dur="110s"
          repeatCount="indefinite"/>
    </feTurbulence>

    <feComponentTransfer in="noise1" result="circles1">
      <feFuncA type="discrete" tableValues="0 0.5 1 0"/>
    </feComponentTransfer>

    <!-- Second layer - medium circles with different phase -->
    <feTurbulence
        type="fractalNoise"
        baseFrequency="0.004 0.004"
        numOctaves="1"
        seed="2"
        result="noise2">
      <animate
          attributeName="baseFrequency"
          values="0.004 0.004;0.01 0.1"
          dur="120s"
          repeatCount="indefinite"/>
    </feTurbulence>

    <feComponentTransfer in="noise2" result="circles2">
      <feFuncR type="discrete" tableValues="1 0.5 0 1"/>
      <feFuncG type="discrete" tableValues="1 0.5 0 1"/>
      <feFuncB type="discrete" tableValues="1 0.5 0 1"/>
    </feComponentTransfer>

    <!-- Blend the circle layers -->
    <feBlend
        in="circles1"
        in2="circles2"
        mode="multiply"
        result="blendedCircles"/>

    <!-- Sharpen the edges slightly -->
    <feConvolveMatrix
        order="3"
        kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"
        in="blendedCircles"
        result="sharpenedCircles"/>

    <!-- Create the displacement -->
    <feDisplacementMap
        in="SourceGraphic"
        in2="sharpenedCircles"
        scale="18"
        xChannelSelector="R"
        yChannelSelector="G"/>
  </filter>
</template>

<style scoped>

</style>