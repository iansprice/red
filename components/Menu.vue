<script setup lang="ts">
export type Link = {
  title: string;
  to: any;
}

const props = defineProps<{ title?: string, links: Link[] }>()
</script>

<template>
  <div class="text-center">
    <div class="text text-xl font-mono my-3" v-if="title">
      {{ title }}
    </div>
    <div class="text-2xl my-3 flex flex-col">
      <NuxtLink v-for="link in links" :key="link.title" :to="link.to" class="hover:text-primary">{{link.title}}</NuxtLink>
    </div>
  </div>
</template>

<style scoped>

</style>