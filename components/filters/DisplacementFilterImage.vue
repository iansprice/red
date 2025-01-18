<script setup lang="ts">
  defineProps<{
    id: string,
    src: string,
  }>()
</script>

<template>
  <filter :id="id">
    <!-- Load the external GIF -->
    <feImage
        :href="src"
        result="map"
        preserveAspectRatio="none"
        x="0" y="0" width="100%" height="100%"/>
    <!-- Apply displacement using the GIF -->
    <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale="2"
        xChannelSelector="R"
        yChannelSelector="G"/>
  </filter>
</template>

<style scoped>

</style>