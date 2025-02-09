<script setup lang="ts">
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";

import {ref, onUnmounted, onMounted} from 'vue'
import {TresCanvas, useRenderLoop} from '@tresjs/core'
import {OrbitControls, Ocean,} from '@tresjs/cientos'
import * as THREE from 'three'

import {ExtrudeGeometryOptions} from "three/src/geometries/ExtrudeGeometry";

// Grid rotation state
const gridRotation = ref(new THREE.Euler(0, 0, 0))

// Create mountain shape
const mountainShape = new THREE.Shape()
// Starting point
mountainShape.moveTo(-1, 0)
// First mountain (taller)
mountainShape.lineTo(-3, 0)
mountainShape.lineTo(-1, 3.6) // 20% taller
mountainShape.lineTo(1, 0)
// Second mountain
mountainShape.lineTo(-1, 0)
mountainShape.lineTo(1, 3)
mountainShape.lineTo(3, 0)
// Close the shape
mountainShape.lineTo(-1, 0)
mountainShape.autoClose = true

// Extrusion settings
const extrudeSettings: ExtrudeGeometryOptions = {
  steps: 2,
  depth: 0.8, // Thickness of the mountains
  bevelEnabled: false,
  bevelThickness: 0.02,
  bevelSize: 0.02,
}

// Text geometry setup
const fontLoader = new FontLoader()
const mounted = ref(false)

// Corner text geometries
const textGeometries = ref({
  PROJECTS: null,
  WORK: null,
  MUSIC: null,
  WRITING: null
})

onMounted(() => {
  setTimeout(() => mounted.value = true, 250)
})

// Animation loop
const {onLoop} = useRenderLoop()
onLoop(() => {
  // Update grid rotation
  gridRotation.value.y -= 0.002
})

const cameraTarget = new THREE.Vector3(0, 1, 0) // Target point above grid
const autoRotating = ref(true)

// Clean up
onUnmounted(() => {
  stop()
})
</script>

<template>
  <div class="h-screen">
    <Menu
        class="!z-50 pointer-events-auto"
        style="z-index: 50; pointer-events: auto; isolation: isolate; position: relative"
        :links="[{title: 'Work', to:{name:'projects'}}, {title: 'Blog', to: {name:'blog'}},{title: 'Bridgets', to: 'bridgets/1'}]"/>
    <transition name="fade-slow">
      <div
          class="h-[100vh] w-screen absolute top-0"
          v-show="mounted"
          @click.meta="autoRotating=false"
      >
        <TresCanvas style="z-index: 1">
          <TresPerspectiveCamera
              :zoom="0.5"
              :position="[2, 1, 20]"
              :lookAt="[-5, -4, -2]"
          />
          <TresAmbientLight :intensity="0.5"/>
          <TresDirectionalLight
              :position="[5, 5, 5]"
              :intensity="5"
              :castShadow="true"
          />
          <Stars :size="1" :depth="400" :count="50"
                 :size-attenuation="true"/>
          <!-- Mountains -->
          <TresMesh
              :position="[0, 1.5, 0]"
              :rotation="[0, 0, 0]"
              :castShadow="true"
              :receiveShadow="true"
          >
            <TresExtrudeGeometry
                :args="[mountainShape, extrudeSettings]"
            />
            <TresMeshStandardMaterial
                :color="0x8B0000"
                :metalness="0.3"
                :roughness="0.2"
                :side="THREE.DoubleSide"

            />
          </TresMesh>

          <Suspense>
            <Ocean
                :alpha="0.8"
                :clip-bias="0.5"
                :distortion-scale="1"
                :texture-width="5096"
                :texture-height="5096"
            />
          </Suspense>

          <!-- Controls -->
          <OrbitControls
              :autoRotate="autoRotating"
              :autoRotateSpeed=".6"
              :dampingFactor=".2"
              :enableDamping="true"
              :enablePan="false"
              :enableRotate="true"
              :min-distance="7.5"
              :max-distance="400"
              :minPolarAngle="Math.PI / 4.5"
              :maxPolarAngle="Math.PI / 2"
              :target="cameraTarget"
          />
        </TresCanvas>
      </div>
    </transition>
  </div>
</template>

<style>
</style>