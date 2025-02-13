<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
    <Menu title="Work" />
    <div class="my-6 gap-6 flex flex-wrap self-center justify-center items-center align-middle">
      <NuxtLink
          v-for="(project, index) in projects"
          :key="project.path"
          :to="project.path"
      >
        <Project
            :project="project"
            :index="index"
            class="flex-basis-1/2"
        />
      </NuxtLink>
    </div>
    <div class="my-6 flex justify-center items-center">
    <SpotlightButton :to="{name:'~'}" >
      Return
    </SpotlightButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import Project from "../../components/content/Project.vue";

const { data: projects }: { data: Project[]} = await useAsyncData('projects', () =>
    queryCollection('projects').all()
)
</script>

<style>
</style>
