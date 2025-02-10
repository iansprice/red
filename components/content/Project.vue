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
      <CardBody class="bg-black/10">
          <CardItem
              :translate-z="120"
              :rotate-z="3 * (index % 2 ? -1 : 1)"
              class="my-6 w-full flex justify-center items-center"
          >
            <img :src="project.meta.logo" :alt="`${project.title} logo`" class="w-auto !h-32"/>
          </CardItem>
          <CardItem class="mx-6 my-3" :translate-z="50">
            <h2 class="text-xl font-extrabold">{{ project.title }}</h2>
          </CardItem>
          <CardItem class="mx-6 my-3" :translate-z="50">
            <p class="mt-2 ">{{ project.description }}</p>
          </CardItem>
<!--          <CardItem class="mx-6 mt-[80px] italic flex justify-center items-center" :translate-x="110" :translate-z="50" :translate-y="10">-->
<!--            <div class="opacity-0 transition-opacity ease-in duration-150 group-hover:opacity-50">-->
<!--              Learn more-->
<!--            </div>-->
<!--          </CardItem>-->
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