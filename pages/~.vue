<script setup lang="ts">

import {ref, onUnmounted, onMounted, shallowRef} from 'vue'
import {TresCanvas, } from '@tresjs/core'
import { EffectComposer, UnrealBloom } from '@tresjs/post-processing'
import {OrbitControls, Ocean, Sky} from '@tresjs/cientos'
import * as THREE from 'three'
import {ExtrudeGeometryOptions} from "three/src/geometries/ExtrudeGeometry";
import {Vector3} from "three";
import useOscillate from "../composables/useOscillate";
import SpinningText from "../components/ui/SpinningText.vue";

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

const mounted = useState('mounted', () => false)

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
    // Set environment map
  }, 250)
})

const cameraTarget = new THREE.Vector3(0, 1, 0)
const autoRotating = ref(true)

onUnmounted(() => {
  stop()
})

const azimuth = useLocalStorage('azimuth', 141.6, {transform: Number})
const distance = useLocalStorage('distance', 625000, {transform: Number})
const elevation = useLocalStorage('elevation', -.2, {transform: Number})  // Increased elevation for higher sun position
const mieCoefficient = useLocalStorage('mieCoefficient', 3.6, {transform: Number})  // Reduced for less atmospheric scattering
const mieDirectionalG = useLocalStorage('mieDirectionalG', 0.04, {transform: Number})  // Increased for sharper sun appearance
const rayleigh = useLocalStorage('rayleigh', 12.7, {transform: Number})  // Reduced for less atmospheric scattering
const turbidity = useLocalStorage('turbidity', .16, {transform: Number})  // Reduced for clearer sky
const orbitRotateSpeed = useLocalStorage('orbitRotateSpeed', .16, {transform: Number})

// const {assignValueOnLoop} = useOscillate({
//   min: 0,
//   max: 500,
//   amplitudeRatio: .3,
//   skew:.5,
//   cycleLengthSeconds: 10,
//   trigonometricFunction: 'Sin',
// })
// assignValueOnLoop(rayleigh, rayleighOut)

const skyRef = shallowRef(undefined)
</script>

<template>
  <div>
    <Menu
        class="z-1 pointer-events-auto"
        style="z-index: 50; pointer-events: auto; isolation: isolate; position: relative"
        :links="[{title: 'Work', to:{name:'projects'}}, {title:'Demos', to:'/demos'}]"/>
    <ControlsPopover>
      <LazyLogDial
          v-model.number="azimuth"
          label="Azimuth"
          :min-value="0.01"
          :max-value="360"
          :size="120"
          class="z-10 pointer-events-auto"
      />
      <LazyLogDial
          v-model.number="distance"
          label="Distance (box)"
          :min-value="0.01"
          :max-value="100000"
          :size="120"
          class="z-10 pointer-events-auto"
      />
      <LazyLogDial
          v-model.number="elevation"
          label="Elevation"
          :min-value="-50"
          :max-value="200"
          :size="120"
          class="z-10 pointer-events-auto"
      />
      <LazyLogDial
          v-model.number="mieCoefficient"
          label="MIE coefficient"
          :min-value="0.0001"
          :max-value="10"
          :size="120"
          class=""
      />
      <LazyLogDial
          v-model.number="mieDirectionalG"
          label="MIE Directional G"
          :min-value="0.01"
          :max-value="360"
          :size="120"
          class=""
      />
      <LazyLogDial
          v-model.number="rayleigh"
          label="Rayleigh"
          :min-value="0.01"
          :max-value="3600"
          :size="120"
          class="z-10 pointer-events-auto"
      />
      <LazyLogDial
          v-model.number="turbidity"
          label="Turbidity"
          :min-value="0.01"
          :max-value="10000"
          :size="120"
          class="z-10 pointer-events-auto"
      />
      <LazyLogDial
          v-model.number="orbitRotateSpeed"
          label="Rotate speed"
          :min-value="-30"
          :max-value="30"
          :size="120"
          class="z-10 pointer-events-auto"
      />
    </ControlsPopover>
    <div class="absolute flex justify-around items-center h-screen w-screen -top-8 pointer-events-none">

    </div>
    <transition name="fade-slow">
      <div
          class="h-screen w-screen absolute top-0"
          v-show="mounted"
      >
        <TresCanvas
            window-size
            shadows
            style="z-index: 1"
        >
            <TresPerspectiveCamera
                :zoom="0.5"
                :position="[2, 1, 20]"
                :lookAt="[-15, -4, -2]"
            />
            <TresDirectionalLight
                :position="[5, 5, 5]"
                :intensity="5"
                :castShadow="true"
            />
            <TresAmbientLight :intensity="50"/>
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
            <primitive v-if="skyRef" :object="skyRef" />

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
                  :envMapIntensity=".2"
                  v-if="skyRef"
                  :envMap="skyRef?.background"
                  :side="THREE.DoubleSide"
              />
            </TresMesh>
            <Suspense>
              <Ocean
                  :texture-width="5096"
                  :texture-height="5096"
              />
            </Suspense>

          <EffectComposer>
            <UnrealBloom :radius="0.5" :strength="1.5" :threshold="0.8" />
          </EffectComposer>

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
        </TresCanvas>
      </div>
    </transition>
  </div>
</template>