<script setup lang="ts">
import OnceMorphingText from "./ui/OnceMorphingText.vue";

export type Link = {
  title: string;
  to: any;
}

withDefaults(
    defineProps<{
      title?: string,
      links?: Link[]
    }>(), {
      links: []
    }
)
</script>

<template>
  <div class="text-center z-10">
    <OnceMorphingText class="scale-50" :text="title" v-if="title"/>
    <div class="text-2xl my-3 flex flex-col" v-if="links?.length">
      <NuxtLink v-for="link in links" :key="link.title" :to="link.to" class="hover:text-primary">{{ link.title }}
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>

</style>