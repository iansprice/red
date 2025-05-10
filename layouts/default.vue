<template>
  <div>
    <div class="fixed inset-0 bg-gradient-to-bl from-zinc-600 to-sky-600 dark:bg-gradient-to-bl dark:from-zinc-900 dark:to-sky-900">
      <!-- This is just the background layer -->
    </div>
    <div class="relative min-h-screen w-full overflow-x-hidden font-sans text-black dark:text-white">
      <!-- Your content goes here -->
      <div class="z-50 pointer-events-auto flex flex-col justify-center items-center md:scale-100 pt-3" style="z-index: 50; pointer-events: auto; isolation: isolate; position: relative;">
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
      </div>
      <div v-if="false">
        <NavigationScroller/>
      </div>
    </div>
  </div>

</template>

<script setup lang="ts">
const mounted = useState('mounted', () => false)
onMounted(() => mounted.value = true)
</script>

<style>
</style>