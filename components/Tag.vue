<script setup lang="ts">
  defineProps<{
    value: string,
  }>()
</script>

<template>
  <button
      class="bg-gray-700/60 hover:bg-gray-600 transition-opacity duration-200 text-white px-1.5 py-0.5 text-sm hover:scale-105 transition-transform duration-200 rounded-md"
  >
    {{value}}
  </button>
</template>

<style scoped>

</style>