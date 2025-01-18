<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-3xl font-bold ">Projects</h1>
    <div class="mt-6 grid gap-8 lg:grid-cols-2">
      <Project
          v-for="project in projects"
          :key="project._path"
          :project="project"
      />
    </div>
  </div>
</template>

<script setup>
import Project from "../../components/Project.vue";

const { data: projects } = await useAsyncData('projects', () =>
    queryContent('projects').find()
)
</script>

