<template>
  <div
      class="min-h-screen transition-colors duration-300 font-sans text-black dark:text-white bg-gradient-to-bl from-zinc-600 to-sky-600 dark:bg-gradient-to-bl darK:from-zinc-900 dark:to-sky-900"
  >
    <transition name="zoom">
      <div class="top-3 w-screen text-center text-2xl text-black font-mono font-extrabold z-20" v-if="$route.name !== 'index'"  >
        RED MOUNTAIN SOFTWARE
      </div>
    </transition>
    <transition name="zoom" >
      <UBreadcrumb
          v-if="!['horses','index'].includes($route.name)"
          divider="/"
          :links="[{ label: 'Home', to: {name:'horses'} }, { label: 'Projects', to: {name: 'projects'} }, { label: $route.matched.title }]"
      />
    </transition>
    {{$route}}
    <NuxtPage/>
  </div>
</template>

<script setup>
</script>

<style>
</style>