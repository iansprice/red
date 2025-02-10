<script setup lang="ts">
import CardBody from "../ui/CardBody.vue";
import CardContainer from "../ui/CardContainer.vue";
import CardItem from "../ui/CardItem.vue";

defineProps<{
  project: any
  index: number
}>()
</script>

<template>
  <NuxtLink
      :to="project.path"
      :style="{viewTransitionName: `project-${project.id}`}"
      class="project-card"
  >
    <CardContainer class="group">
      <CardBody class="hover:bg-black/10 bg-transparent transition-colors duration-200">
          <CardItem
              :translate-z="140"
              :rotate-z="3 * (index % 2 ? -1 : 1)"
              class="my-6 mt-12 w-full flex justify-center items-center"
          >
            <img :src="project.meta.logo" :alt="`${project.title} logo`" class="w-auto !h-32"/>
          </CardItem>
          <CardItem class="mx-6 my-3" :translate-z="60">
            <h2 class="text-xl font-extrabold">{{ project.title }}</h2>
          </CardItem>
          <CardItem class="mx-6 my-3 text-primary" :translate-z="60">
            <p class="mt-2">{{ project.description }}</p>
          </CardItem>
      </CardBody>
    </CardContainer>
  </NuxtLink>
</template>

<style scoped>

/* Optional: Fade in the new content */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.project-detail > *:not(img) {
  animation: fade-in 0.3s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0;
}
</style>