<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <h1 class="text-3xl font-bold text-center">Projects</h1>
    <Prose class="mt-6 gap-6 flex flex-col self-center items-center align-middle">
      <Project
          v-for="project in projects"
          :key="project.path"
          :project="project"
          class="flex-1"
      />
    </Prose>
    <div class="my-6">
    <SpotlightButton :to="{name:'horses'}" >
      Return
    </SpotlightButton>
    </div>
  </div>
</template>

<script setup>
const { data: projects } = await useAsyncData('projects', () =>
    queryCollection('projects').all()
)

</script>

