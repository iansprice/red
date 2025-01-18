// Oscilloscope.vue
<script setup lang="ts">
interface OscillateProps {
  value: number;
  max?: number;
  min?: number;
  centerPhase?: boolean;
  timeWindow?: number;
  maxPoints?: number;  // Maximum number of points to store
  stroke: string;
}

const props = withDefaults(defineProps<OscillateProps>(), {
  max: 100,
  min: -100,
  centerPhase: false,
  timeWindow: 2,
  maxPoints: 10000,  // Significantly increased
  stroke: '#00ff00'
})

import { ref, onMounted, onBeforeUnmount } from 'vue'

const displayCanvas = ref<HTMLCanvasElement | null>(null)
let offscreenCanvas: HTMLCanvasElement | null = null
let ctx: CanvasRenderingContext2D | null = null
let offscreenCtx: CanvasRenderingContext2D | null = null
let animationFrame: number | null = null
let logicalHeight = 0
let logicalWidth = 0
let lastSampleTime = 0

interface ValuePoint {
  value: number;
  timestamp: number;
  raw: number;    // Store raw value for interpolation
}

const valueHistory = ref<ValuePoint[]>([])

// Increased sampling rate (0.1ms = 10kHz)
const SAMPLE_INTERVAL = 0.1

function addValueToHistory(value: number, now: number) {
  if (now - lastSampleTime >= SAMPLE_INTERVAL) {
    // Store raw value for interpolation
    valueHistory.value.push({
      value,
      timestamp: now,
      raw: value
    })
    lastSampleTime = now

    // Maintain history
    const cutoffTime = now - props.timeWindow * 1000
    valueHistory.value = valueHistory.value.filter(point => point.timestamp >= cutoffTime)

    // More sophisticated subsampling if needed
    if (valueHistory.value.length > props.maxPoints) {
      // Use every third point but interpolate values
      const subsampled = []
      for (let i = 0; i < valueHistory.value.length; i += 3) {
        const point = valueHistory.value[i]
        if (i > 0 && i < valueHistory.value.length - 1) {
          // Interpolate between points for smoother subsampling
          const prev = valueHistory.value[i - 1]
          const next = valueHistory.value[i + 1]
          point.value = (prev.raw + point.raw + next.raw) / 3
        }
        subsampled.push(point)
      }
      valueHistory.value = subsampled
    }
  }
}

function drawGrid() {
  if (!ctx) return

  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1
  const gridSpacing = 50

  // Vertical grid lines
  for (let x = 0; x < logicalWidth; x += gridSpacing) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, logicalHeight)
    ctx.stroke()
  }

  // Horizontal grid lines
  for (let y = 0; y < logicalHeight; y += gridSpacing) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(logicalWidth, y)
    ctx.stroke()
  }

  // Draw center line
  ctx.strokeStyle = '#666'
  ctx.beginPath()
  ctx.moveTo(0, logicalHeight/2)
  ctx.lineTo(logicalWidth, logicalHeight/2)
  ctx.stroke()

  if (props.centerPhase) {
    ctx.beginPath()
    ctx.moveTo(logicalWidth/2, 0)
    ctx.lineTo(logicalWidth/2, logicalHeight)
    ctx.stroke()
  }
}

function draw() {
  if (!displayCanvas.value || !ctx) {
    animationFrame = requestAnimationFrame(draw)
    return
  }

  const now = performance.now()
  addValueToHistory(props.value, now)

  // Clear canvas with higher quality
  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, logicalWidth, logicalHeight)

  drawGrid()

  const padding = 10
  // Draw high quality trace
  if (valueHistory.value.length > 1) {
    // Draw main trace
    ctx.beginPath()
    ctx.strokeStyle = props.stroke
    ctx.lineWidth = 5
    ctx.imageSmoothingQuality = 'high'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    const range = props.max - props.min
    const centerY = logicalHeight / 2
    const heightScale = logicalHeight * 0.4

    // Use a path with bezier curves for smoother lines
    let lastX = 0
    let lastY = 0
    let firstPoint = true

    valueHistory.value.forEach((point, i) => {
      let x: number
      if (props.centerPhase) {
        const timeFromCenter = (point.timestamp - now) / 1000
        const normalizedX = timeFromCenter / (props.timeWindow / 2)
        x = logicalWidth/2 + normalizedX * (logicalWidth/2)
      } else {
        const age = (now - point.timestamp) / 1000
        x = logicalWidth - (age / props.timeWindow) * logicalWidth
      }

      const normalizedValue = (point.value - props.min) / range * 2 - 1
      const y = centerY + normalizedValue * -heightScale

      if (firstPoint) {
        ctx.moveTo(x, y)
        firstPoint = false
      } else {
        // Use quadratic curves between points for smoothing
        const cpX = (lastX + x) / 2
        ctx.quadraticCurveTo(cpX, lastY, x, y)
      }

      lastX = x
      lastY = y
    })

    // Draw the main stroke
    ctx.stroke()

  } else {
    ctx.fillText(props.max.toString(), logicalWidth - padding, padding + 12)
    ctx.fillText(((props.max + props.min) / 2).toString(), logicalWidth - padding, logicalHeight / 2)
    ctx.fillText(props.min.toString(), logicalWidth - padding, logicalHeight - padding)
  }

  // Draw value indicators with anti-aliasing

  ctx.font = '12px monospace'
  ctx.fillStyle = '#888'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'

  ctx.fillText(`${props.value.toFixed(3)}`, logicalWidth - padding, padding + 32)

  animationFrame = requestAnimationFrame(draw)
}

function initializeCanvas() {
  if (!displayCanvas.value) return

  const dpr = window.devicePixelRatio || 1
  const rect = displayCanvas.value.getBoundingClientRect()

  logicalWidth = rect.width
  logicalHeight = rect.height

  // Set up main canvas
  displayCanvas.value.width = rect.width * dpr * 2  // Double resolution
  displayCanvas.value.height = rect.height * dpr * 2

  ctx = displayCanvas.value.getContext('2d', {
    alpha: false,
    antialias: true,
    desynchronized: true,
  })

  if (!ctx) return

  // Scale for high DPI and supersampling
  ctx.scale(dpr * 2, dpr * 2)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
}

onMounted(() => {
  if (!displayCanvas.value) return

  initializeCanvas()
  lastSampleTime = performance.now()
  animationFrame = requestAnimationFrame(draw)

  window.addEventListener('resize', initializeCanvas)
})

onBeforeUnmount(() => {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame)
  }
  window.removeEventListener('resize', initializeCanvas)
})
</script>

<template>
  <div class="p-4 bg-gray-900 rounded-lg">
    <canvas
        ref="displayCanvas"
        class="w-full h-[400px] bg-gray-800 rounded border border-gray-700"
    />
    <div class="mt-4 text-gray-200 text-sm grid grid-cols-2 gap-2">
      <div>Range: {{ min }} to {{ max }}</div>
      <div>Window: {{ timeWindow }}s</div>
      <div>Mode: {{ centerPhase ? 'Centered' : 'Normal' }}</div>
    </div>
  </div>
</template>