<template>
  <div id="zoom-wrapper" :class="['fixed top-0 transition-all duration-1000 ease-out', {'!bg-background': stage==='inside-planet'}]">
    <svg width="100vw" height="100vh" >
      <defs>
        <!-- Grid pattern -->
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" stroke-width="3.5">
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
          </path>
        </pattern>

        <!-- Radial gradient for splash effect -->
        <radialGradient id="splashGradient"  r="0.1" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="white" stop-opacity="1"/>
          <stop offset="50%" stop-color="white" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>

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

          <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="6"
              result="displaced"/>

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
        <CursorRipple />
      </defs>

      <!-- Main content -->
      <g transform="matrix(1,0,0.1,0.95,0.9,0.95)">
        <!-- Background with base effects -->
        <g filter="url(#turbulentBlur)">
          <!-- Shadow filter -->

          <g class="pool-only">
            <rect width="10000%" height="10000%" fill="#5289e3" transform="translate(-500, -10)" :opacity="0.8"/>
            <rect width="10000%" height="10000%" fill="url(#grid)" transform="translate(-500, -10)" class="zoom-rect"/>
          </g>
          <!-- Text with ripple effect -->
          <g :filter="stage.includes('planet') ? 'url(#cursorRipple)' : undefined"
             :class="['transform-gpu opacity-100 transition-opacity duration-500', {'opacity-25': stage === 'inside-planet'}, {'!opacity-0': stage === 'fade-planet'}]"
          >
            <text x="0vw" y="50vh"
                  class="opacity-0 mix-blend-hard-light animate-[fade-in_0.25s_ease-in_forwards_2s]"
                  text-anchor="start"
                  filter="url(#dis1)"
                  dominant-baseline="middle"
                  font-family="Arial Black, Arial, sans-serif"
                  font-weight="900"
                  font-size="20vw"
                  fill="#db4740">
              RED
            </text>
            <text x="0.5vw" y="72vh"
                  class="opacity-0 mix-blend-hard-light animate-[fade-in_0.25s_ease-in_forwards_3s]"
                  text-anchor="start"
                  dominant-baseline="middle"
                  filter="url(#dis1)"
                  font-family="Arial Black, Arial, sans-serif"
                  font-weight="900"
                  font-size="12vw"
                  fill="#db4740">
              MOUNTAIN
            </text>
            <text x="1vw" y="89vh"
                  class="opacity-0 mix-blend-hard-light animate-[fade-in_0.25s_ease-in_forwards_4s]"
                  text-anchor="start"
                  dominant-baseline="middle"
                  filter="url(#dis1)"
                  font-family="Arial Black, Arial, sans-serif"
                  font-weight="900"
                  font-size="11vw"
                  fill="#db4740">
              SOFTWARE
            </text>
          </g>
        </g>
      </g>
    </svg>
      <Planet
          class="fixed top-0 !right-0 fit pb-0"
          :class="['fixed', {'top-0 !right-0 ': stage==='planet'}, 'fit pb-0']"
          v-if="['planet','inside-planet', 'fade-planet'].includes(stage)"
          @expanded="stage='inside-planet'"
          @inner-click="stage='fade-planet'"
          @inner-click-end="onPlanetZoomed"
      />
  </div>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue';
import DisplacementCircles from "../components/filters/DisplacementCircles.vue";
import {navigateTo} from "nuxt/app";
import Ripple from "../components/filters/CursorRipple.vue";
import CursorRipple from "../components/filters/CursorRipple.vue";

const onPlanetZoomed = () => navigateTo({name:'~'})
type Stage = 'pool' | 'planet' | 'inside-planet' | 'fade-planet'
const stage: Ref<Stage> = ref('pool')

setTimeout(() => {
  stage.value = 'planet';
}, 4000)

watch(
    stage,
    (s, oS) => {
      if (oS) {
        document.querySelector<SVGSVGElement>(`.${oS}-only`)?.remove()
      }
    },
    {immediate: true}
)
</script>

<style>
@keyframes fade-in {
  from {
    opacity: .1;
  }
  to {
    opacity: 1;
  }
}

@keyframes zoomEffect {
  from {
    transform: translate(-500px, -10px) scale(0.002);
  }
  to {
    transform: translate(-500px, -10px) scale(1);
  }
}

.zoom-rect {
  animation: zoomEffect 2s ease-in ;
}
</style>