<template>
  <div
      class="min-h-screen transition-colors duration-300 font-sans text-black dark:text-white bg-gradient-to-bl from-zinc-600 to-sky-600 dark:bg-gradient-to-bl dark:from-zinc-900 dark:to-sky-900"
  >
    <transition name="zoom">
      <div class="flex flex-col justify-center items-center" v-if="$route.name !== 'index'">
      <svg width="460" height="40" v-if="$route.name !== 'index'">
        <defs>
          <filter id="turbulentBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
                type="turbulence"
                baseFrequency="0.1"
                numOctaves="1"
                result="turbulence">
              <animate
                  attributeName="baseFrequency"
                  values="0.005;0.01;0.001;0.005"
                  dur="10s"
                  repeatCount="indefinite"/>
            </feTurbulence>


            <feGaussianBlur
                in="displaced"
                stdDeviation="1.0"
                result="blurred"/>

            <feComposite
                in="blurred"
                in2="SourceGraphic"
                operator="arithmetic"
                k1="0.3"
                k2="0.5"
                k3="0"
                k4="0"/>
          </filter>
          <DisplacementCircles id="dis1"/>
          <animate
              attributeName="stroke-width"
              values="0;3.5"
              dur="1.5s"
              repeatCount="0"
          />
          <animate
              attributeName="stroke-opacity"
              values="0;1"
              dur="1s"
              repeatCount="0"
          />
        </defs>
        <g filter="url(#dis1)">
          <text x="0vw" y="28"
                class="opacity-0 mix-blend-hard-light animate-[fade-in_0.25s_ease-in_forwards_0.2s]"
                text-anchor="start"
                dominant-baseline="middle"
                font-family="Arial Black, Arial, sans-serif"
                font-weight="900"
                font-size="30px"
                fill="#db4740">
            RED MOUNTAIN SOFTWARE
          </text>
        </g>
      </svg>
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
import Ripple from "../components/filters/CursorRipple.vue";
import CursorRipple from "../components/filters/CursorRipple.vue";
import DisplacementCircles from "../components/filters/DisplacementCircles.vue";
</script>

<style>
</style>