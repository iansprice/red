<template>
  <svg class="hidden">
    <filter width="100%" height="100%" x="0%" y="0%" id="noise"><feTurbulence type="turbulence" baseFrequency="0.0547184" id="turbulence" numOctaves="1" result="turbulence" seed="5">
      <animate id="noiseAnimate" attributeName="baseFrequency" values="0;.1;0,0" from="0" to="100" dur="10s" repeatCount="indefinite"></animate>
    </feTurbulence>
      <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="30" xChannelSelector="R" yChannelSelector="R"></feDisplacementMap>
    </filter>
  </svg>
  <div
      class="min-h-screen transition-colors duration-300 font-sans text-black dark:text-white bg-gradient-to-bl from-zinc-600 to-sky-600 dark:bg-gradient-to-bl darK:from-zinc-900 dark:to-sky-900"
      style="filter(#noise)"
  >
    <NuxtPage/>
  </div>
</template>

<script setup>

</script>