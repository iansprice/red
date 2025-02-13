<script setup lang="ts">
  import useOscillate from "../../composables/useOscillate";

  const props = withDefaults(defineProps<{
    id: string,
    it?: number,
    seed?: number,
    octaves?: number,
    in1: number,
    in2: number,
    in3: number,
  }>(), {
    it: 80,
    seed: 100,
    octaves:1,
  })


</script>

<template>
  <filter :id="id">
    <!-- First layer - larger circles -->
    <feTurbulence
        type="fractalNoise"
        :baseFrequency="`${in1} ${in2}`"
        numOctaves="1"
        seed=".01"
        result="noise1">
    </feTurbulence>

    <feComponentTransfer in="noise1" result="circles1">
      <feFuncA type="discrete" :tableValues="`${in1} ${in3} 1 ${in2}`"/>
    </feComponentTransfer>

    <!-- Second layer - medium circles with different phase -->
    <feTurbulence
        type="fractalNoise"
        :baseFrequency="`${in2} ${in1}`"
        numOctaves="1"
        :seed="seed"
        result="noise2">
    </feTurbulence>

    <feComponentTransfer in="noise2" result="circles2">
      <feFuncR type="discrete" :tableValues="`1 0.5 ${in3} 1`"/>
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
        :scale="it"
        xChannelSelector="R"
        yChannelSelector="G"/>
  </filter>
</template>

<style scoped>

</style>