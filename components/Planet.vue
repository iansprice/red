<template>
  <div
      ref="mountRef"
      class="fixed top-8 right-8 h-96 w-96 opacity-90"
      @mouseenter="handleHover(true)"
      @mouseleave="handleHover(false)"
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
import { ref, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const mountRef = ref(null)
const sphereButton = ref(null)
const isOpen = ref(false)

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

// For inner sphere pulsing
const pulseValue = shallowRef({
  scale: 1,
  direction: 1
})

const updateInnerSpherePosition = () => {
  const obj = threeObjects.value
  if (!obj.innerSphere || !sphereButton.value) return

  // Get screen position of inner sphere
  const vector = new THREE.Vector3()
  obj.innerSphere.getWorldPosition(vector)
  vector.project(obj.camera)

  const x = (vector.x * 0.5 + 0.5) * 400
  const y = -(vector.y * 0.5 - 0.5) * 400

  sphereButton.value.style.left = `${x}px`
  sphereButton.value.style.top = `${y}px`
}

const OUTER_SPHERE_COLOR = new THREE.Color(219/255, 79/255, 64/255)
const OUTER_SPHERE_HOVER_COLOR = new THREE.Color(0/255, 139/255, 139/255)
const INNER_SPHERE_COLOR = new THREE.Color(0/255, 255/255, 255/255)
const INNER_SPHERE_HOVER_COLOR = new THREE.Color(220/255, 20/255, 60/255)

const OUTER_SPHERE_OPACITY = 1.0
const OUTER_SPHERE_HOVER_OPACITY = 0.1
const INNER_SPHERE_OPACITY = 0.7
const INNER_SPHERE_HOVER_OPACITY = 1.0
const initScene = () => {
  const obj = threeObjects.value

  // Scene setup
  obj.scene = new THREE.Scene()
  obj.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  obj.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  })

  obj.renderer.setSize(400, 400)
  if (mountRef.value) {
    mountRef.value.appendChild(obj.renderer.domElement)
  }

  // Create shell halves
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

  // Create and position shell halves
  obj.leftShell = new THREE.Mesh(shellGeometry, shellMaterial)
  obj.rightShell = new THREE.Mesh(shellGeometry, shellMaterial)
  obj.rightShell.rotation.y = Math.PI

  // Create pivot points for shell rotation
  obj.leftPivot = new THREE.Object3D()
  obj.rightPivot = new THREE.Object3D()

  obj.leftPivot.add(obj.leftShell)
  obj.rightPivot.add(obj.rightShell)

  obj.scene.add(obj.leftPivot)
  obj.scene.add(obj.rightPivot)

  // Create inner sphere
  const innerGeometry = new THREE.IcosahedronGeometry(1.5, 1)
  const innerMaterial = new THREE.MeshBasicMaterial({
    color: INNER_SPHERE_COLOR,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  })
  obj.innerSphere = new THREE.Mesh(innerGeometry, innerMaterial)
  obj.scene.add(obj.innerSphere)

  // Add lights
  const light1 = new THREE.PointLight(0xffffff, 1)
  light1.position.set(10, 10, 10)
  obj.scene.add(light1)

  const light2 = new THREE.PointLight(0xffffff, 0.5)
  light2.position.set(-10, -10, -10)
  obj.scene.add(light2)

  // Camera and controls
  obj.camera.position.z = 15

  obj.controls = new OrbitControls(obj.camera, obj.renderer.domElement)
  obj.controls.enableDamping = true
  obj.controls.dampingFactor = 0.05
  obj.controls.enableZoom = false
  obj.controls.autoRotate = true
  obj.controls.autoRotateSpeed = .2
}

// Add color transition state to the explosion state
const explosionState = ref({
  progress: 0,
  startTime: 0,
  isAnimating: false,
  targetValue: 0,
  duration: 500,
  // Add starting and target colors
  startInnerColor: INNER_SPHERE_COLOR.clone(),
  targetInnerColor: INNER_SPHERE_COLOR.clone(),
  startOuterColor: OUTER_SPHERE_COLOR.clone(),
  targetOuterColor: OUTER_SPHERE_COLOR.clone(),
  startInnerOpacity: INNER_SPHERE_OPACITY,
  targetInnerOpacity: INNER_SPHERE_OPACITY,
  startOuterOpacity: OUTER_SPHERE_OPACITY,
  targetOuterOpacity: OUTER_SPHERE_OPACITY
})

// Modify handleHover to set up color transition
const handleHover = (hovered: boolean): void => {
  isOpen.value = hovered

  const state = explosionState.value

  // Store current colors as starting colors
  state.startInnerColor.copy(threeObjects.value.innerSphere!.material.color)
  state.startOuterColor.copy(threeObjects.value.leftShell!.material.color)
  state.startInnerOpacity = threeObjects.value.innerSphere!.material.opacity
  state.startOuterOpacity = threeObjects.value.leftShell!.material.opacity

  // Set target colors based on hover state
  if (hovered) {
    state.targetInnerColor = INNER_SPHERE_HOVER_COLOR
    state.targetOuterColor = OUTER_SPHERE_HOVER_COLOR
    state.targetInnerOpacity = INNER_SPHERE_HOVER_OPACITY
    state.targetOuterOpacity = OUTER_SPHERE_HOVER_OPACITY
  } else {
    state.targetInnerColor = INNER_SPHERE_COLOR
    state.targetOuterColor = OUTER_SPHERE_COLOR
    state.targetInnerOpacity = INNER_SPHERE_OPACITY
    state.targetOuterOpacity = OUTER_SPHERE_OPACITY
  }

  // Start animation
  explosionState.value = {
    ...state,
    startTime: performance.now(),
    isAnimating: true,
    targetValue: hovered ? 1 : 0
  }
}

// Modify animate function to include color transitions
const animate = (): void => {
  const obj = threeObjects.value
  if (!obj.renderer || !obj.scene || !obj.camera) return

  obj.frameId = requestAnimationFrame(animate)

  // Handle explosion and color animation
  if (explosionState.value.isAnimating) {
    const currentTime = performance.now()
    const elapsed = currentTime - explosionState.value.startTime
    const progress = Math.min(elapsed / explosionState.value.duration, 1)
    const state = explosionState.value

    // Use easing function for smooth animation
    const eased = easeInOutCubic(progress)

    // Animate explosion
    const explosionValue = state.targetValue === 1 ? eased : 1 - eased
    animateExplosion(explosionValue)

    // Animate colors and opacity
    const tempColor = new THREE.Color()

    // Inner sphere color transition
    tempColor.copy(state.startInnerColor)
    obj.innerSphere!.material.color.copy(tempColor.lerp(state.targetInnerColor, eased))
    obj.innerSphere!.material.opacity = state.startInnerOpacity +
        (state.targetInnerOpacity - state.startInnerOpacity) * eased

    // Outer spheres color transition
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

  // Rest of animate function...
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


// Add an explosion animation function
const animateExplosion = (progress: 0|1) => {
  const obj = threeObjects.value
  if (!obj.leftShell || !obj.rightShell) return

  const leftPositions = obj.leftShell.geometry.attributes.position
  const rightPositions = obj.rightShell.geometry.attributes.position

  for (let i = 0; i < leftPositions.array.length; i += 3) {
    const explosionFactor = 2 // Adjust this to control explosion intensity

    // Left shell
    const xL = obj.leftShellOriginalVertices[i]
    const yL = obj.leftShellOriginalVertices[i + 1]
    const zL = obj.leftShellOriginalVertices[i + 2]

    leftPositions.array[i] = xL + (xL * explosionFactor * progress)
    leftPositions.array[i + 1] = yL + (yL * explosionFactor * progress)
    leftPositions.array[i + 2] = zL + (zL * explosionFactor * progress)

    // Right shell
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

// Add easing function for smooth animation
const easeInOutCubic = (t: number): number => {
  return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const handleInnerSphereClick = () => {
  window.location.href = '/your-link-here' // Replace with your desired link
}

const cleanup = () => {
  const obj = threeObjects.value
  if (obj.frameId) {
    cancelAnimationFrame(obj.frameId)
  }

  if (mountRef.value && obj.renderer) {
    mountRef.value.removeChild(obj.renderer.domElement)
  }

  // Dispose of geometries and materials
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

// Lifecycle hooks
onMounted(() => {
  initScene()
  animate()
})

onBeforeUnmount(() => {
  cleanup()
})

// Resize handler
const handleResize = () => {
  const obj = threeObjects.value
  if (obj.camera && obj.renderer) {
    const width = 400
    const height = 400

    obj.camera.aspect = width / height
    obj.camera.updateProjectionMatrix()
    obj.renderer.setSize(width, height)
  }
}

window.addEventListener('resize', handleResize)
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.inner-sphere-button {
  background: transparent;
  pointer-events: auto;
}
</style>