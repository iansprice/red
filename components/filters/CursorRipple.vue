<script setup lang="ts">
withDefaults(
    defineProps<{
      turbulenceFreq: [number]
    }>(),
    {turbulenceFreq: 0.05}
)
</script>

<template>
  <filter id="cursorRipple" x="-50%" y="-50%" width="200%" height="200%">
    <!-- Create intense local distortion -->
    <feTurbulence
        type="fractalNoise"
        :baseFrequency="turbulenceFreq"
        numOctaves="3"
        seed="5"
        result="noise">
      <animate
          attributeName="baseFrequency"
          :values="`${turbulenceFreq},${turbulenceFreq};${turbulenceFreq*2},${turbulenceFreq*2};${turbulenceFreq},${turbulenceFreq}`"
          dur="0.5s"
          repeatCount="indefinite"/>
    </feTurbulence>

    <!-- Create splash mask -->
    <feImage
        width="300"
        height="300"
        href="#splashGradient"
        result="splash"/>

    <!-- Combine noise with splash -->
    <feDisplacementMap
        in="SourceGraphic"
        in2="noise"
        scale="180"
        xChannelSelector="R"
        yChannelSelector="G"
        result="displacement"/>

    <!-- Apply splash mask -->
    <feComposite
        in="displacement"
        in2="splash"
        operator="in"
        result="maskedDisplacement"/>

    <!-- Blend with original -->
    <feComposite
        in="SourceGraphic"
        in2="maskedDisplacement"
        operator="arithmetic"
        k1="1"
        k2="0.5"
        k3="0"
        k4="0"/>
  </filter>
</template>

<style scoped>

</style>