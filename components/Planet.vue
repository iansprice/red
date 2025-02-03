<template>
  <div
      ref="mountRef"
      :class="{
      'fixed inset-0 z-50': isExpanded,
      'w-[400px] h-[400px]': !isExpanded
    }"
      class="transition-all duration-500 ease-in-out"
      @mouseenter="handleFirstHover"
  >
    <button
        ref="sphereButton"
        @click="handleInnerSphereClick"
        class="absolute w-12 h-12 rounded-full cursor-pointer hover:opacity-50 transition-opacity"
        style="transform: translate(-50%, -50%)"
        aria-label="Inner sphere interaction"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { navigateTo } from "nuxt/app"

const mountRef = ref(null)
const sphereButton = ref(null)
const isExpanded = ref(false)
const hasBeenHovered = ref(false)
const isZooming = ref(false)

const emit = defineEmits<{expanded: [boolean], 'inner-click': [void], 'inner-click-end': [void]}>()

watch(
    isExpanded,
    (e) => {
      emit("expanded", e)
    },
)

const OUTER_SPHERE_COLOR = new THREE.Color(219/255, 79/255, 64/255)
const OUTER_SPHERE_HOVER_COLOR = new THREE.Color(0/255, 139/255, 139/255)
const INNER_SPHERE_COLOR = new THREE.Color(0/255, 255/255, 255/255)
const INNER_SPHERE_HOVER_COLOR = new THREE.Color(220/255, 20/255, 60/255)

const OUTER_SPHERE_OPACITY = 1.0
const OUTER_SPHERE_HOVER_OPACITY = 0.1
const INNER_SPHERE_OPACITY = 0.7
const INNER_SPHERE_HOVER_OPACITY = 1.0

const threeObjects = shallowRef({
  scene: null,
  camera: null,
  renderer: null,
  controls: null,
  leftShell: null,
  rightShell: null,
  leftPivot: null,
  rightPivot: null,
  innerSphere: null,
  frameId: null,
  leftShellOriginalVertices: null,
  rightShellOriginalVertices: null,
})

const explosionState = ref({
  progress: 0,
  startTime: 0,
  isAnimating: false,
  targetValue: 0,
  duration: 500,
  startInnerColor: INNER_SPHERE_COLOR.clone(),
  targetInnerColor: INNER_SPHERE_COLOR.clone(),
  startOuterColor: OUTER_SPHERE_COLOR.clone(),
  targetOuterColor: OUTER_SPHERE_COLOR.clone(),
  startInnerOpacity: INNER_SPHERE_OPACITY,
  targetInnerOpacity: INNER_SPHERE_OPACITY,
  startOuterOpacity: OUTER_SPHERE_OPACITY,
  targetOuterOpacity: OUTER_SPHERE_OPACITY
})


// Add zoom animation state
const zoomState = ref({
  startTime: 0,
  duration: 1000,
  startCameraPosition: new THREE.Vector3(),
  targetCameraPosition: new THREE.Vector3(0, 0, 1), // Close to inner sphere
  isAnimating: false
})

const pulseValue = shallowRef({
  scale: 1,
  direction: 1
})

const updateInnerSpherePosition = () => {
  const obj = threeObjects.value
  if (!obj.innerSphere || !sphereButton.value) return

  const vector = new THREE.Vector3()
  obj.innerSphere.getWorldPosition(vector)
  vector.project(obj.camera)

  const x = (vector.x * 0.5 + 0.5) * (isExpanded.value ? window.innerWidth : 400)
  const y = -(vector.y * 0.5 - 0.5) * (isExpanded.value ? window.innerHeight : 400)

  sphereButton.value.style.left = `${x}px`
  sphereButton.value.style.top = `${y}px`
}

const initScene = () => {
  const obj = threeObjects.value

  obj.scene = new THREE.Scene()
  obj.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  obj.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })

  updateRendererSize()

  if (mountRef.value) {
    mountRef.value.appendChild(obj.renderer.domElement)
  }

  const shellGeometry = new THREE.SphereGeometry(5, 32, 16, 0, Math.PI, 0, Math.PI)
  const shellMaterial = new THREE.MeshBasicMaterial({
    color: OUTER_SPHERE_COLOR,
    wireframe: true,
    transparent: true,
    opacity: OUTER_SPHERE_OPACITY,
    side: THREE.DoubleSide
  })

  obj.leftShellOriginalVertices = shellGeometry.attributes.position.array.slice()
  obj.rightShellOriginalVertices = shellGeometry.attributes.position.array.slice()

  obj.leftShell = new THREE.Mesh(shellGeometry, shellMaterial)
  obj.rightShell = new THREE.Mesh(shellGeometry, shellMaterial)
  obj.rightShell.rotation.y = Math.PI

  obj.leftPivot = new THREE.Object3D()
  obj.rightPivot = new THREE.Object3D()

  obj.leftPivot.add(obj.leftShell)
  obj.rightPivot.add(obj.rightShell)

  obj.scene.add(obj.leftPivot)
  obj.scene.add(obj.rightPivot)

  const innerGeometry = new THREE.IcosahedronGeometry(1.5, 1)
  const innerMaterial = new THREE.MeshBasicMaterial({
    color: INNER_SPHERE_COLOR,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  })
  obj.innerSphere = new THREE.Mesh(innerGeometry, innerMaterial)
  obj.scene.add(obj.innerSphere)

  const light1 = new THREE.PointLight(0xffffff, 1)
  light1.position.set(10, 10, 10)
  obj.scene.add(light1)

  const light2 = new THREE.PointLight(0xffffff, 0.5)
  light2.position.set(-10, -10, -10)
  obj.scene.add(light2)

  obj.camera.position.z = 15

  obj.controls = new OrbitControls(obj.camera, obj.renderer.domElement)
  obj.controls.enableDamping = true
  obj.controls.dampingFactor = 0.05
  obj.controls.enableZoom = false
  obj.controls.autoRotate = true
  obj.controls.autoRotateSpeed = .2
}

const handleFirstHover = () => {
  if (hasBeenHovered.value) return
  hasBeenHovered.value = true
  isExpanded.value = true

  const state = explosionState.value

  state.startInnerColor.copy(threeObjects.value.innerSphere!.material.color)
  state.startOuterColor.copy(threeObjects.value.leftShell!.material.color)
  state.startInnerOpacity = threeObjects.value.innerSphere!.material.opacity
  state.startOuterOpacity = threeObjects.value.leftShell!.material.opacity

  state.targetInnerColor = INNER_SPHERE_HOVER_COLOR
  state.targetOuterColor = OUTER_SPHERE_HOVER_COLOR
  state.targetInnerOpacity = INNER_SPHERE_HOVER_OPACITY
  state.targetOuterOpacity = OUTER_SPHERE_HOVER_OPACITY

  explosionState.value = {
    ...state,
    startTime: performance.now(),
    isAnimating: true,
    targetValue: 1
  }
}

const updateRendererSize = () => {
  const obj = threeObjects.value
  if (!obj.renderer || !obj.camera) return

  const width = isExpanded.value ? window.innerWidth : 400
  const height = isExpanded.value ? window.innerHeight : 400

  obj.renderer.setSize(width, height)
  obj.camera.aspect = width / height
  obj.camera.updateProjectionMatrix()

  if (isExpanded.value) {
    obj.camera.position.z = 25
  } else {
    obj.camera.position.z = 15
  }
}

const animate = (): void => {
  const obj = threeObjects.value
  if (!obj.renderer || !obj.scene || !obj.camera) return

  obj.frameId = requestAnimationFrame(animate)

  // Handle zoom animation
  if (zoomState.value.isAnimating) {
    const currentTime = performance.now()
    const elapsed = currentTime - zoomState.value.startTime
    const progress = Math.min(elapsed / zoomState.value.duration, 1)

    const eased = easeInOutCubic(progress)

    // Interpolate camera position
    obj.camera.position.lerpVectors(
        zoomState.value.startCameraPosition,
        zoomState.value.targetCameraPosition,
        eased
    )


    obj.innerSphere.material.opacity = INNER_SPHERE_OPACITY * (1 - eased)

    // Scale down explosion during zoom
    if (obj.leftShell && obj.rightShell) {
      const scaleDownFactor = 1 + eased ** 2
      obj.leftShell.scale.set(scaleDownFactor, scaleDownFactor, scaleDownFactor)
      obj.rightShell.scale.set(scaleDownFactor, scaleDownFactor, scaleDownFactor)
    }

    // Fade out outer shells
    if (obj.leftShell && obj.rightShell) {
      obj.leftShell.material.opacity = OUTER_SPHERE_OPACITY * (1 - eased)
      obj.rightShell.material.opacity = OUTER_SPHERE_OPACITY * (1 - eased)
    }

    if (progress >= 1) {
      zoomState.value.isAnimating = false
    }
  }

  if (explosionState.value.isAnimating) {
    const currentTime = performance.now()
    const elapsed = currentTime - explosionState.value.startTime
    const progress = Math.min(elapsed / explosionState.value.duration, 1)
    const state = explosionState.value

    const eased = easeInOutCubic(progress)

    const explosionValue = state.targetValue === 1 ? eased : 1 - eased
    animateExplosion(explosionValue)

    const tempColor = new THREE.Color()

    tempColor.copy(state.startInnerColor)
    obj.innerSphere!.material.color.copy(tempColor.lerp(state.targetInnerColor, eased))
    obj.innerSphere!.material.opacity = state.startInnerOpacity +
        (state.targetInnerOpacity - state.startInnerOpacity) * eased

    tempColor.copy(state.startOuterColor)
    const lerpedOuterColor = tempColor.lerp(state.targetOuterColor, eased)
    obj.leftShell!.material.color.copy(lerpedOuterColor)
    obj.rightShell!.material.color.copy(lerpedOuterColor)

    const currentOuterOpacity = state.startOuterOpacity +
        (state.targetOuterOpacity - state.startOuterOpacity) * eased
    obj.leftShell!.material.opacity = currentOuterOpacity
    obj.rightShell!.material.opacity = currentOuterOpacity

    if (progress >= 1) {
      explosionState.value.isAnimating = false
    }
  }

  if (obj.innerSphere) {
    if (pulseValue.value.scale >= 1.2) pulseValue.value.direction = -1
    if (pulseValue.value.scale <= 0.8) pulseValue.value.direction = 1

    pulseValue.value.scale += 0.005 * pulseValue.value.direction

    obj.innerSphere.scale.set(
        pulseValue.value.scale,
        pulseValue.value.scale,
        pulseValue.value.scale
    )

    updateInnerSpherePosition()
  }

  if (obj.controls) {
    obj.controls.update()
  }

  obj.renderer.render(obj.scene, obj.camera)
}

const animateExplosion = (progress: number) => {
  const obj = threeObjects.value
  if (!obj.leftShell || !obj.rightShell) return

  const leftPositions = obj.leftShell.geometry.attributes.position
  const rightPositions = obj.rightShell.geometry.attributes.position

  for (let i = 0; i < leftPositions.array.length; i += 3) {
    const explosionFactor = 2

    const xL = obj.leftShellOriginalVertices[i]
    const yL = obj.leftShellOriginalVertices[i + 1]
    const zL = obj.leftShellOriginalVertices[i + 2]

    leftPositions.array[i] = xL + (xL * explosionFactor * progress)
    leftPositions.array[i + 1] = yL + (yL * explosionFactor * progress)
    leftPositions.array[i + 2] = zL + (zL * explosionFactor * progress)

    const xR = obj.rightShellOriginalVertices[i]
    const yR = obj.rightShellOriginalVertices[i + 1]
    const zR = obj.rightShellOriginalVertices[i + 2]

    rightPositions.array[i] = xR + (xR * explosionFactor * progress)
    rightPositions.array[i + 1] = yR + (yR * explosionFactor * progress)
    rightPositions.array[i + 2] = zR + (zR * explosionFactor * progress)
  }

  leftPositions.needsUpdate = true
  rightPositions.needsUpdate = true
}

const easeInOutCubic = (t: number): number => {
  return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2
}
const handleInnerSphereClick = () => {
  emit('inner-click')
  if (isZooming.value) return

  const obj = threeObjects.value
  if (!obj.camera) return

  isZooming.value = true
  obj.controls.enabled = false // Disable controls during zoom

  // Store current camera position
  zoomState.value.startCameraPosition.copy(obj.camera.position)
  zoomState.value.startTime = performance.now()
  zoomState.value.isAnimating = true

  // Use setTimeout instead of setInterval for cleaner timing
  setTimeout(() => {
    // Reset animation state
    zoomState.value.isAnimating = false
    obj.controls.enabled = true
    isZooming.value = false

    emit('inner-click-end')
  }, zoomState.value.duration)
}

const cleanup = () => {
  const obj = threeObjects.value
  if (obj.frameId) {
    cancelAnimationFrame(obj.frameId)
  }

  if (mountRef.value && obj.renderer) {
    mountRef.value.removeChild(obj.renderer.domElement)
  }

  if (obj.leftShell) {
    obj.leftShell.geometry.dispose()
    obj.leftShell.material.dispose()
  }
  if (obj.rightShell) {
    obj.rightShell.geometry.dispose()
    obj.rightShell.material.dispose()
  }
  if (obj.innerSphere) {
    obj.innerSphere.geometry.dispose()
    obj.innerSphere.material.dispose()
  }

  if (obj.renderer) {
    obj.renderer.dispose()
  }
}


watch(isExpanded, () => {
  updateRendererSize()
})

onMounted(() => {
  initScene()
  animate()
})

onBeforeUnmount(() => {
  cleanup()
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  if (isExpanded.value) {
    updateRendererSize()
  }
}

window.addEventListener('resize', handleResize)
</script>

<style scoped>
.inner-sphere-button {
  background: transparent;
  pointer-events: auto;
}
</style>