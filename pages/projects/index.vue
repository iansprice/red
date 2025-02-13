<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
    <Menu title="Work" :links="[]"/>
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

<script setup>
const { data: projects } = await useAsyncData('projects', () =>
    queryCollection('projects').all()
)

const handleProjectClick = (project) => {
  // Store the clicked project's position for the transition
  const projectElement = document.querySelector(`[data-project-id="${project.id}"]`)
  if (projectElement) {
    const rect = projectElement.getBoundingClientRect()
    sessionStorage.setItem('projectTransition', JSON.stringify({
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }))
  }
  const router = useRouter()
  router.push(project.path)
}
</script>

<style>
</style>
