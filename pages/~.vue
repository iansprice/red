<script setup lang="ts">
</script>

<template>
  <Menu
      class="z-50 pointer-events-auto"
      style="z-index: 50; pointer-events: auto; isolation: isolate; position: relative"
      :links="[{title: 'Work', to:{name:'projects'}}, {title:'Oscilloscope', to:'/demos/oscilloscope'}]"
  />
</template>