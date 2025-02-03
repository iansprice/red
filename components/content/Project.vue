<script setup lang="ts">

import {type Project} from "../../types/types";

defineProps<{ project: Project }>()
</script>

<template>
  <SpotlightButton :to="project._path">
    <article class="overflow-hidden cursor-pointer w-100 flex">
      <Prose class="p-6 grow">
        <div class="flex justify-center">
          <img v-if="project.logo" :src="project.logo" :alt="`${project.title} logo`" class="h-12 w-auto "/>
          <h2 v-else class="text-xl font-semibold grow">{{ project.title }}</h2>
        </div>
        <p class="mt-2 ">{{ project.description }}</p>
      </Prose>
    </article>
  </SpotlightButton>
</template>

<style scoped>

</style>