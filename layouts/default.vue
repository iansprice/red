<template>
  <div
      class="min-h-screen transition-colors duration-300 font-sans text-black dark:text-white bg-gradient-to-bl from-zinc-600 to-sky-600 dark:bg-gradient-to-bl darK:from-zinc-900 dark:to-sky-900"
  >
    <transition name="zoom">
      <div class="top-3 w-screen text-center text-2xl text-black font-mono font-extrabold z-20" v-if="$route.name !== 'index'"  >
        RED MOUNTAIN SOFTWARE
      </div>
    </transition>

    <NuxtPage/>
  </div>
</template>

<script setup>
// const route = useRoute()
// const page = await queryCollection('content')
//     .where('path', 'LIKE', route.path.substring(1))
//     .first()
// const breadcrumbs = []
// const pagePathExploded = page.path.split('/')
//
// let tmpPagePath = ''
//
// for (const pagePathItem of pagePathExploded) {
//   if (pagePathItem === '') continue
//   tmpPagePath += `/${pagePathItem}`
//   breadcrumbs.push(await queryCollection('content').path(tmpPagePath).select('title', 'path').first())
// }
// const links = breadcrumbs.map(bc => ({label: bc.title, to: bc.path}))
</script>

<style>
</style>