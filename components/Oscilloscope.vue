//Oscilloscope.vue
<script setup lang="ts">
interface OscillateProps {
  value: number;
  max?: number;
  min?: number;
  centerPhase?: boolean;
  timeWindow?: number;
  maxPoints?: number;
  stroke: string;
}

const props = withDefaults(defineProps<OscillateProps>(), {
  max: 100,
  min: -100,
  centerPhase: false,
  timeWindow: 2,
  maxPoints: 2000,
  stroke: '#00ff00'
})

import { ref, onMounted, onBeforeUnmount } from 'vue'

const displayCanvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrame: number | null = null
let logicalHeight = 0
let logicalWidth = 0
let lastValue = 0
let lastTimestamp = 0

interface ValuePoint {
  value: number;
  timestamp: number;
}

const valueHistory = ref<ValuePoint[]>([])

function interpolatePoints(start: ValuePoint, end: ValuePoint, pixelWidth: number): ValuePoint[] {
  const points: ValuePoint[] = [];
  const timeStep = (end.timestamp - start.timestamp) / pixelWidth;
  const valueStep = (end.value - start.value) / pixelWidth;

  for (let i = 0; i < pixelWidth; i++) {
    points.push({
      timestamp: start.timestamp + timeStep * i,
      value: start.value + valueStep * i
    });
  }

  return points;
}

function addValueToHistory(value: number, now: number) {
  // If this is the first point or there's been a significant time gap, just add the point
  if (valueHistory.value.length === 0 || now - lastTimestamp > 16) {
    valueHistory.value.push({ value, timestamp: now });
  } else {
    // Calculate how many pixels this time interval represents
    const timeRange = props.timeWindow * 1000;
    const pixelsPerMs = logicalWidth / timeRange;
    const timeDelta = now - lastTimestamp;
    const pixelWidth = Math.ceil(timeDelta * pixelsPerMs);

    // If we need more than 1 pixel width of points, interpolate
    if (pixelWidth > 1) {
      const newPoints = interpolatePoints(
          { value: lastValue, timestamp: lastTimestamp },
          { value, timestamp: now },
          pixelWidth
      );
      valueHistory.value.push(...newPoints);
    } else {
      valueHistory.value.push({ value, timestamp: now });
    }
  }

  lastValue = value;
  lastTimestamp = now;

  // Clean up old points
  const cutoffTime = now - props.timeWindow * 1000;
  valueHistory.value = valueHistory.value.filter(point => point.timestamp >= cutoffTime);

  // Limit total points while maintaining visual density
  if (valueHistory.value.length > props.maxPoints) {
    const stride = Math.ceil(valueHistory.value.length / props.maxPoints);
    valueHistory.value = valueHistory.value.filter((_, index) => index % stride === 0);
  }
}

function drawGrid() {
  if (!ctx) return;

  ctx.strokeStyle = '#333';
  ctx.lineWidth = 0.5;
  const gridSpacing = 50;

  for (let x = 0; x < logicalWidth; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, logicalHeight);
    ctx.stroke();
  }

  for (let y = 0; y < logicalHeight; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(logicalWidth, y + 0.5);
    ctx.stroke();
  }

  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, logicalHeight/2 + 0.5);
  ctx.lineTo(logicalWidth, logicalHeight/2 + 0.5);
  ctx.stroke();

  if (props.centerPhase) {
    ctx.beginPath();
    ctx.moveTo(logicalWidth/2 + 0.5, 0);
    ctx.lineTo(logicalWidth/2 + 0.5, logicalHeight);
    ctx.stroke();
  }
}

const range = computed(() => props.max - props.min)

function draw() {
  if (!displayCanvas.value || !ctx) {
    animationFrame = requestAnimationFrame(draw);
    return;
  }

  const now = performance.now();
  addValueToHistory(props.value, now);

  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, logicalWidth, logicalHeight);

  drawGrid();

  if (valueHistory.value.length > 1) {
    const centerY = logicalHeight / 2;
    const heightScale = (logicalHeight * 0.4);

    // Draw main trace
    ctx.beginPath();
    ctx.strokeStyle = props.stroke;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    let firstPoint = true;
    valueHistory.value.forEach((point) => {
      let x: number;
      if (props.centerPhase) {
        const timeFromCenter = (point.timestamp - now) / 1000;
        const normalizedX = timeFromCenter / (props.timeWindow / 2);
        x = logicalWidth/2 + normalizedX * (logicalWidth/2);
      } else {
        const age = (now - point.timestamp) / 1000;
        x = logicalWidth - (age / props.timeWindow) * logicalWidth;
      }

      const normalizedValue = (point.value - props.min) / range.value * 2 - 1;
      const y = centerY + normalizedValue * -heightScale;

      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Add subtle glow
    ctx.save();
    ctx.strokeStyle = props.stroke + '20';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.restore();
  }

  // Draw value indicators
  ctx.font = '12px monospace';
  ctx.fillStyle = '#888';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  const padding = 10;
  ctx.fillText(`${props.value.toFixed(2)}`, logicalWidth - padding, padding + 32);

  animationFrame = requestAnimationFrame(draw);
}

function initializeCanvas() {
  if (!displayCanvas.value) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = displayCanvas.value.getBoundingClientRect();

  logicalWidth = rect.width;
  logicalHeight = rect.height;

  displayCanvas.value.width = rect.width * dpr;
  displayCanvas.value.height = rect.height * dpr;

  ctx = displayCanvas.value.getContext('2d', {
    alpha: false,
    antialias: true,
    desynchronized: true
  });

  if (!ctx) return;

  ctx.scale(dpr, dpr);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}

onMounted(() => {
  if (!displayCanvas.value) return;

  initializeCanvas();
  lastTimestamp = performance.now();
  animationFrame = requestAnimationFrame(draw);

  window.addEventListener('resize', initializeCanvas);
});

onBeforeUnmount(() => {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
  }
  window.removeEventListener('resize', initializeCanvas);
});
</script>

<template>
  <div class="p-4 bg-gray-900 rounded-lg">
    <canvas
        ref="displayCanvas"
        class="w-full h-[400px] bg-gray-800 rounded border border-gray-700"
    />
    <slot/>
  </div>
</template>