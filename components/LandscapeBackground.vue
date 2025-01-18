<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 600"
      :class="{ 'theme-dark': isDark }"
      class="theme-transition"
  >
    <rect width="1200" height="600" class="bg"/>

    <!-- Stars -->
    <g class="stars">
      <circle v-for="star in stars"
              :key="star.id"
              :cx="star.x"
              :cy="star.y"
              :r="star.r"
              class="fill-white"
              :style="{
                animationDelay: `${star.delay}ms`,
                opacity: isDark ? 1 : 0
              }"
      />
    </g>

    <!-- Complex Mountains (Franklin Mountains inspired) -->
    <path
        d="M0 250
         L100 200 L150 180 L200 220 L250 190 L300 240 L350 200
         L400 170 L450 220 L500 180 L550 210 L600 150 L650 190
         L700 160 L750 200 L800 170 L850 220 L900 180 L950 200
         L1000 170 L1050 190 L1100 220 L1150 180 L1200 220
         L1200 600 L0 600 Z"
        class="mountains-back"
    />

    <!-- Middle Range (Brazos Cliffs inspired) -->
    <path
        d="M0 300
         L50 280 L100 320 L150 290 L200 310 L250 280 L300 330
         L350 300 L400 340 L450 310 L500 320 L550 290 L600 330
         L650 300 L700 280 L750 320 L800 290 L850 310 L900 350
         L950 320 L1000 300 L1050 330 L1100 310 L1150 290 L1200 300
         L1200 600 L0 600 Z"
        class="mountains-mid"
    />

    <!-- Terrain -->
    <path
        d="M0 400 L200 380 L400 420 L600 390 L800 430 L1000 400 L1200 420 L1200 600 L0 600 Z"
        class="terrain"
    />

    <!-- Desert floor -->
    <path
        d="M0 460 L1200 460 L1200 600 L0 600 Z"
        class="floor"
    />

    <!-- Far plants (smallest, most faded) -->
    <g v-for="plant in farPlants" :key="plant.id" :class="plant+'-controller'">
      <!-- Ocotillo -->
      <g v-if="plant.type === 'ocotillo'"
         :transform="`translate(${plant.x}, ${plant.y}) scale(${plant.scale})`"
         :style="{ opacity: plant.opacity }">
        <path class="plant-stroke"
              d="M0 0 L-2 -20 L-5 -40 L-8 -50
                   M0 0 L2 -20 L5 -40 L8 -50
                   M0 0 L-4 -15 L-8 -30 L-12 -45
                   M0 0 L4 -15 L8 -30 L12 -45"
              stroke-width="2"
              fill="none"/>
      </g>
      <!-- Yucca -->
      <g v-else-if="plant.type === 'yucca'"
         :transform="`translate(${plant.x}, ${plant.y}) scale(${plant.scale})`"
         :style="{ opacity: plant.opacity }">
        <path class="plant-stroke"
              d="M0 0 L0 -30
                   M0 -25 L-15 -40 M0 -25 L15 -40
                   M0 -20 L-12 -35 M0 -20 L12 -35
                   M0 -15 L-10 -30 M0 -15 L10 -30"
              stroke-width="2"
              fill="none"/>
      </g>
      <!-- Shrub -->
      <g v-else
         :transform="`translate(${plant.x}, ${plant.y}) scale(${plant.scale})`"
         :style="{ opacity: plant.opacity }">
        <path class="plant-stroke"
              d="M0 0 C-10 -10 -20 -15 -25 -18
                   M0 0 C10 -10 20 -15 25 -18
                   M0 0 C-8 -12 -15 -20 -20 -25
                   M0 0 C8 -12 15 -20 20 -25"
              stroke-width="2"
              fill="none"/>
      </g>
    </g>

    <!-- Mid plants -->
    <g v-for="plant in midPlants" :key="plant.id" :class="plant+'-mid-group'">
      <!-- Ocotillo -->
      <g v-if="plant.type === 'ocotillo'"
         :transform="`translate(${plant.x}, ${plant.y}) scale(${plant.scale**1.8})`"
         :style="{ opacity: plant.opacity }">
        <path class="plant-stroke"
              d="M0 0 L-2 -20 L-5 -40 L-8 -50
                   M0 0 L2 -20 L5 -40 L8 -50
                   M0 0 L-4 -15 L-8 -30 L-12 -45
                   M0 0 L4 -15 L8 -30 L12 -45"
              stroke-width="2"
              fill="none"/>
      </g>
      <!-- Yucca -->
      <g v-else-if="plant.type === 'yucca'"
         :transform="`translate(${plant.x}, ${plant.y}) scale(${plant.scale})`"
         :style="{ opacity: plant.opacity }">
        <path class="plant-stroke"
              d="M0 0 L0 -30
                   M0 -25 L-15 -40 M0 -25 L15 -40
                   M0 -20 L-12 -35 M0 -20 L12 -35
                   M0 -15 L-10 -30 M0 -15 L10 -30"
              stroke-width="2"
              fill="none"/>
      </g>
      <!-- Shrub -->
      <g v-else
         :transform="`translate(${plant.x}, ${plant.y}) scale(${plant.scale})`"
         :style="{ opacity: plant.opacity }">
        <path class="plant-stroke"
              d="M0 0 C-10 -10 -20 -15 -25 -18
                   M0 0 C10 -10 20 -15 25 -18
                   M0 0 C-8 -12 -15 -20 -20 -25
                   M0 0 C8 -12 15 -20 20 -25"
              stroke-width="2"
              fill="none"/>
      </g>
    </g>

    <!-- Near plants (largest, most vivid) -->

    <!-- Similar structure as above with foreground properties -->
    <g v-for="plant in nearPlants" :key="plant.id" :class="plant+'-mid-group'">
      <!-- Similar structure as above with mid-range properties -->
      <!-- Ocotillo -->
      <g v-if="plant.type === 'ocotillo'"
         :transform="`translate(${plant.x}, ${plant.y}) scale(${plant.scale**1.8})`"
         :style="{ opacity: plant.opacity }">
        <path class="plant-stroke"
              d="M0 0 L-2 -20 L-5 -40 L-8 -50
                   M0 0 L2 -20 L5 -40 L8 -50
                   M0 0 L-4 -15 L-8 -30 L-12 -45
                   M0 0 L4 -15 L8 -30 L12 -45"
              stroke-width="2"
              fill="none"/>
      </g>
      <!-- Yucca -->
      <g v-else-if="plant.type === 'yucca'"
         :transform="`translate(${plant.x}, ${plant.y}) scale(${plant.scale})`"
         :style="{ opacity: plant.opacity }">
        <path class="plant-stroke"
              d="M0 0 L0 -30
                   M0 -25 L-15 -40 M0 -25 L15 -40
                   M0 -20 L-12 -35 M0 -20 L12 -35
                   M0 -15 L-10 -30 M0 -15 L10 -30"
              stroke-width="2"
              fill="none"/>
      </g>
      <!-- Shrub -->
      <g v-else
         :transform="`translate(${plant.x}, ${plant.y}) scale(${plant.scale})`"
         :style="{ opacity: plant.opacity }">
        <path class="plant-stroke"
              d="M0 0 C-10 -10 -20 -15 -25 -18
                   M0 0 C10 -10 20 -15 25 -18
                   M0 0 C-8 -12 -15 -20 -20 -25
                   M0 0 C8 -12 15 -20 20 -25"
              stroke-width="2"
              fill="none"/>
      </g>
    </g>
  </svg>
</template>

<script setup>
import {useDark} from '@vueuse/core'

const isDark = useDark()

// Helper function to generate random number within range
const random = (min, max) => Math.random() * (max - min) + min

// Generate plants with depth properties
const generatePlants = (count, yRange, scaleRange, opacityRange) => {
  return Array.from({length: count}, (_, i) => ({
    id: `plant-${yRange[0]}-${i}`,
    type: ['ocotillo', 'yucca', 'shrub'][Math.floor(random(0, 3))],
    x: random(0, 1200),
    y: random(yRange[0], yRange[1]),
    scale: random(scaleRange[0], scaleRange[1]),
    opacity: random(opacityRange[0], opacityRange[1])
  }))
}

// Generate three layers of plants
const farPlants = generatePlants(30, [420, 460], [0.1, 0.15], [0.3, 0.4])
const midPlants = generatePlants(20, [460, 490], [0.4, 0.5], [0.6, 0.8])
const nearPlants = generatePlants(15, [490, 600], [0.6, 0.7], [0.8, 1])

// Stars generation remains the same
const stars = Array.from({length: 50}, (_, i) => ({
  id: i,
  x: random(0, 1200),
  y: random(0, 300),
  r: random(0.5, 2),
  delay: random(0, 15000)
}))
</script>

<style scoped>
.theme-transition * {
  animation-duration: 5000ms;
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
}

/* Plant specific styling */
.plant-stroke {
  stroke: rgb(100, 130, 80);
  transition: stroke 5000ms ease-in-out;
}

.theme-dark .plant-stroke {
  stroke: rgb(60, 70, 90);
}

/* Existing color transitions */
.theme-transition .bg {
  animation-name: bgLight;
}

.theme-transition .mountains-back {
  animation-name: mountainsBackLight;
}

.theme-transition .mountains-mid {
  animation-name: mountainsMidLight;
}

.theme-transition .terrain {
  animation-name: terrainLight;
}

.theme-transition .floor {
  animation-name: floorLight;
}

.theme-dark .bg {
  animation-name: bgDark;
}

.theme-dark .mountains-back {
  animation-name: mountainsBackDark;
}

.theme-dark .mountains-mid {
  animation-name: mountainsMidDark;
}

.theme-dark .terrain {
  animation-name: terrainDark;
}

.theme-dark .floor {
  animation-name: floorDark;
}

/* Star twinkling */
.stars circle {
  transition: opacity 1s ease-in-out;
  animation: twinkle 15s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Your existing color keyframes */
@keyframes bgLight {
  from {
    fill: rgb(38, 25, 52);
  }
  to {
    fill: rgb(255, 220, 200);
  }
}

@keyframes bgDark {
  from {
    fill: rgb(255, 220, 200);
  }
  to {
    fill: rgb(1, 10, 30);
  }
}

/* Mountains back animations */
@keyframes mountainsBackLight {
  from {
    fill: rgba(10, 23, 42, 0.9);
  }
  to {
    fill: rgba(122, 25, 25, 0.8);
  }
}

@keyframes mountainsBackDark {
  from {
    fill: rgba(122, 25, 25, 0.8);
  }
  to {
    fill: rgba(10, 23, 42, 0.9);
  }
}

/* Mountains mid animations */
@keyframes mountainsMidLight {
  from {
    fill: rgba(9, 29, 47, 0.9);
  }
  to {
    fill: rgba(170, 120, 90, 0.9);
  }
}

@keyframes mountainsMidDark {
  from {
    fill: rgba(170, 120, 90, 0.9);
  }
  to {
    fill: rgba(9, 29, 47, 0.9);
  }
}

/* Terrain animations */
@keyframes terrainLight {
  from {
    fill: rgb(22, 34, 56);
  }
  to {
    fill: rgb(190, 140, 100);
  }
}

@keyframes terrainDark {
  from {
    fill: rgb(190, 140, 100);
  }
  to {
    fill: rgb(22, 34, 56);
  }
}

/* Floor animations */
@keyframes floorLight {
  from {
    fill: rgb(7, 26, 33);
  }
  to {
    fill: rgb(201, 176, 153);
  }
}

@keyframes floorDark {
  from {
    fill: rgb(201, 176, 153);
  }
  to {
    fill: rgb(7, 26, 33);
  }
}

/* Plants animations */
@keyframes plantsLight {
  from {
    fill: rgba(85, 75, 110, 0.3);
  }
  to {
    fill: rgba(130, 180, 100, 0.4);
  }
}

@keyframes plantsDark {
  from {
    fill: rgba(130, 180, 100, 0.4);
  }
  to {
    fill: rgba(85, 75, 110, 0.3);
  }
}

/* Waves animations */
@keyframes wavesLight {
  from {
    stroke: rgba(95, 85, 120, 0.2);
  }
  to {
    stroke: rgba(255, 200, 150, 0.3);
  }
}

@keyframes wavesDark {
  from {
    stroke: rgba(255, 200, 150, 0.3);
  }
  to {
    stroke: rgba(95, 85, 120, 0.2);
  }
}

.plant-stroke {
  stroke: rgb(100, 130, 80);
  transition: stroke 5000ms ease-in-out;
}

.theme-dark .plant-stroke {
  stroke: rgb(11, 54, 17);
  transition: stroke 5000ms ease-in-out;
}

/* Add more specific opacity transitions */
.plants-container g {
  transition: opacity 5000ms ease-in-out;
}
</style>