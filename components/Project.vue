<script setup lang="ts">
interface Project {
  title: string;
  description: string;
  tags: string[];
  _path: string;
}
defineProps<{project: Project}>()
</script>

<template>
  <article class="shadow overflow-hidden">
    <Prose class="p-6">
      <h2 class="text-xl font-semibold ">{{ project.title }}</h2>
      <p class="mt-2 ">{{ project.description }}</p>
      <div class="mt-4">
            <span v-for="tag in project.tags" :key="tag" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100  mr-2">
              {{ tag }}
            </span>
      </div>
      <NuxtLink :to="project._path" class="mt-4 inline-flex items-center">
        Learn more →
      </NuxtLink>
    </Prose>
  </article>
</template>

<style scoped>

</style>