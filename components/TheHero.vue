<script setup lang="ts">
  defineProps<{title: string}>()
</script>

<template>
  <header class="relative overflow-hidden min-h-[800px] flex items-center">
    <!-- Background SVG -->
    <DarkModeToggle class="absolute inset-0 z-10 right-5 top-0 h-full"/>
    <div class="absolute inset-0 z-0">
      <!-- Insert the SVG here -->
      <LandscapeBackground/>
    </div>

    <!-- Content Overlay -->
    <div class="relative z-10 max-w-7xl mx-auto px-4 py-24">
      <!-- Semi-transparent backdrop for text -->
      <div class="bg-dune-50/30 dark:bg-twilight-900/30 backdrop-blur-sm rounded-architectural p-8 max-w-2xl prose">
        <h2 class="font-display text-4xl md:text-6xl text-dune-900 dark:text-dune-100 leading-tight">
          {{title}}
        </h2>
        <slot/>
      </div>
    </div>
  </header>
</template>