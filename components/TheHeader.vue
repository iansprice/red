<script setup lang="ts">
const navLinks = [{name: 'Home', path: '/'}, {name:'Projects', path:"/projects"}, {name: 'Blog', path:'/blog'}, {name:'Contact', path:'/contact'}]
</script>

<template>
  <nav class="bg-twilight-800/95 dark:bg-twilight-900/95 backdrop-blur-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <h1 class="font-display text-horizon-200 dark:text-horizon-300">Desert Dawn</h1>
      <div class="space-x-6 flex items-center">
        <NuxtLink
            v-for="link in navLinks"
           :key="link.path"
           :href="link.path"
           class="text-twilight-100 hover:text-horizon-300 dark:text-twilight-200 dark:hover:text-horizon-300 transition-colors">
          {{ link.name }}
        </NuxtLink>
        <!-- Dark mode toggle -->
        <DarkModeToggle/>
      </div>
    </div>
  </nav>
</template>

<style scoped>

</style>