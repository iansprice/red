<script setup lang="ts">
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {ref, onUnmounted, onMounted} from 'vue'
import {TresCanvas, useRenderLoop, extend} from '@tresjs/core'
import {OrbitControls, Ocean, Sky} from '@tresjs/cientos'
import * as THREE from 'three'
import {ExtrudeGeometryOptions} from "three/src/geometries/ExtrudeGeometry";
import {Vector3} from "three";

// Grid rotation state
const gridRotation = ref(new THREE.Euler(0, 0, 0))

// Create mountain shape
const mountainShape = new THREE.Shape()
mountainShape.moveTo(-1, 0)
mountainShape.lineTo(-3, 0)
mountainShape.lineTo(-1, 3.6)
mountainShape.lineTo(1, 0)
mountainShape.lineTo(-1, 0)
mountainShape.lineTo(1, 3)
mountainShape.lineTo(3, 0)
mountainShape.lineTo(-1, 0)
mountainShape.autoClose = true

const extrudeSettings: ExtrudeGeometryOptions = {
  steps: 2,
  depth: 0.8,
  bevelEnabled: false,
  bevelThickness: 0.02,
  bevelSize: 0.02,
}

const mounted = ref(false)
const skyRef = ref()
const sceneRef = ref()

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
    // Set environment map
    if (sceneRef.value && skyRef.value) {
      sceneRef.value.environment = skyRef.value.sky
      // Enable environment lighting
      sceneRef.value.background = skyRef.value.sky
    }
  }, 250)
})

const cameraTarget = new THREE.Vector3(0, 1, 0)
const autoRotating = ref(true)

onUnmounted(() => {
  stop()
})

const azimuth = useLocalStorage('azimuth', 2, {transform: Number})
const distance = useLocalStorage('distance', 15, {transform: Number})
const elevation = useLocalStorage('elevation', 0.5, {transform: Number})  // Increased elevation for higher sun position
const mieCoefficient = useLocalStorage('mieCoefficient', 0.002, {transform: Number})  // Reduced for less atmospheric scattering
const mieDirectionalG = useLocalStorage('mieDirectionalG', 0.9, {transform: Number})  // Increased for sharper sun appearance
const rayleigh = useLocalStorage('rayleigh', 1, {transform: Number})  // Reduced for less atmospheric scattering
const turbidity = useLocalStorage('turbidity', 2, {transform: Number})  // Reduced for clearer sky
const orbitRotateSpeed = useLocalStorage('orbitRotateSpeed', .6, {transform: Number})
</script>

<template>
  <div class="h-screen">
    <Menu
        class="z-1 pointer-events-auto"
        style="z-index: 50; pointer-events: auto; isolation: isolate; position: relative"
        :links="[{title: 'Work', to:{name:'projects'}}, {title:'Oscilloscope', to:'/demos/oscilloscope'}]"/>
    <UPopover
        class="z-10 pointer-events-auto fixed bottom-4 left-4"
        :ui="{strategy: 'override', overlay: {background: 'red'}}"
    >
      <template #default="{open}">
        <UButton
            :class="['z-10 pointer-events-auto']"
            color="white"
            label="Controls"
        >
          <template #trailing="{}">
            <UIcon name="i-heroicons-chevron-up-20-solid" :class="{'rotate-180': open}"/>
          </template>
        </UButton>
      </template>
      <template #panel="{close}">
        <div class="flex flex-wrap bg-transparent z-10 pointer-events-auto">
          <LogDial
              v-model.number="azimuth"
              label="Azimuth"
              :min-value="0.01"
              :max-value="360"
              :size="120"
              class="z-10 pointer-events-auto"
          />
          <LogDial
              v-model.number="distance"
              label="Distance (box)"
              :min-value="0.01"
              :max-value="100000"
              :size="120"
              class="z-10 pointer-events-auto"
          />
          <LogDial
              v-model.number="elevation"
              label="Elevation"
              :min-value="-50"
              :max-value="200"
              :size="120"
              class="z-10 pointer-events-auto"
          />
          <LogDial
              v-model.number="mieCoefficient"
              label="MIE coefficient"
              :min-value="0.0001"
              :max-value="10"
              :size="120"
              class=""
          />
          <LogDial
              v-model.number="mieDirectionalG"
              label="MIE Directional G"
              :min-value="0.01"
              :max-value="360"
              :size="120"
              class=""
          />
          <LogDial
              v-model.number="rayleigh"
              label="Rayleigh"
              :min-value="0.01"
              :max-value="3600"
              :size="120"
              class="z-10 pointer-events-auto"
          />
          <LogDial
              v-model.number="turbidity"
              label="Turbidity"
              :min-value="0.01"
              :max-value="10000"
              :size="120"
              class="z-10 pointer-events-auto"
          />
          <LogDial
              v-model.number="orbitRotateSpeed"
              label="Rotate speed"
              :min-value="-30"
              :max-value="30"
              :size="120"
              class="z-10 pointer-events-auto"
          />
        </div>
      </template>
    </UPopover>
    <transition name="fade-slow">
      <div
          class="h-[100vh] w-screen absolute top-0"
          v-show="mounted"
      >
        <TresCanvas style="z-index: 1">
          <TresScene ref="sceneRef">
            <TresPerspectiveCamera
                :zoom="0.5"
                :position="[2, 1, 20]"
                :lookAt="[-15, -4, -2]"
            />
            <TresAmbientLight :intensity="20"/>
            <Stars
                :count="60"
                :depth="800"
                :size="1.5"
                :size-attenuation="true"
            />
            <Sky
                ref="skyRef"
                :azimuth="azimuth"
                :distance="distance"
                :elevation="elevation"
                :mie-coefficient="mieCoefficient"
                :mie-directional-g="mieDirectionalG"
                :rayleigh="rayleigh"
                :turbidity="turbidity"
            />
            <!-- Mountains with updated material -->
            <TresMesh
                :position="[0, 1.5, 0]"
                :rotation="[0, 0, 0]"
                :castShadow="true"
                :receiveShadow="true"
            >
              <TresExtrudeGeometry
                  :args="[mountainShape, extrudeSettings]"
              />
              <TresMeshPhysicalMaterial
                  :color="0x8B0000"
                  :metalness="0.9"
                  :roughness="0.1"
                  :envMapIntensity="5"
                  :side="THREE.DoubleSide"
              />
            </TresMesh>
            <Smoke/>

            <Suspense>
              <Ocean
                  :distortion-scale="1"
                  :texture-width="5096"
                  :texture-height="5096"
              />
            </Suspense>

            <OrbitControls
                :autoRotate="autoRotating"
                :autoRotateSpeed="orbitRotateSpeed"
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
          </TresScene>
        </TresCanvas>
      </div>
    </transition>
  </div>
</template>