<script setup lang="ts">
defineProps<{ project: any }>()
</script>

<template>
  <SpotlightButton :to="project.path">
    <article class="flex w-full px-6 py-3">
        <img :src="project.meta.logo" :alt="`${project.title} logo`" class="w-12 !h-auto"/>
        <div class="flex-col justify-between align-top text-left mx-6 my-3">
          <h2 class="text-xl font-extrabold">{{ project.title }}</h2>
          <p class="mt-2 ">{{ project.description }}</p>
        </div>
    </article>
  </SpotlightButton>
</template>

<style scoped>

</style>