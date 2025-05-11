<template>
  <div
      class="min-h-screen transition-colors duration-300 font-sans text-black dark:text-white bg-gradient-to-bl from-zinc-600 to-sky-600 dark:bg-gradient-to-bl dark:from-zinc-900 dark:to-sky-900"
  >
    <ClientOnly>
    <div
        class="z-50 pointer-events-auto flex flex-col justify-center items-center dscale-75 md:dscale-100 scale-y-125 pt-3"
        v-if="$route.name !== 'index'"
        style="z-index: 50; pointer-events: auto; isolation: isolate; position: relative;">
      <transition name="zoom">
        <NuxtLink :to="{name:'~'}" class="hover:backdrop-saturate-110 hover:brightness-75 ">
          <LogoSVG :class="['opacity-0 transition-opacity duration-200', {'opacity-100':mounted}]"/>
        </NuxtLink>
      </transition>
    </div>
    </ClientOnly>
    <div class="pb-12">
      <NuxtPage/>
    </div>
    <div v-if="false">
      <NavigationScroller/>
    </div>
  </div>
</template>

<script setup lang="ts">
const mounted = useState('mounted', () => false)
onMounted(() => mounted.value = true)
</script>

<style>
</style>