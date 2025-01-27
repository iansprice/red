<!-- LogDial.vue -->
<template>
  <div :class="['log-dial', {'opacity-50':disabled}]" ref="dialContainer" >
    <svg
        :width="size"
        :height="size"
        @mousedown="startDrag"
        @touchstart="startDrag"
        class="cursor-pointer"
        ref="svg"
    >
      <!-- Background circle -->
      <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          stroke="#e0e0e0"
          stroke-width="2"
      />

      <!-- Active arc -->
      <path
          :d="arcPath"
          fill="none"
          :stroke="color"
          stroke-width="4"
          stroke-linecap="round"
      />

      <!-- Tick marks -->
      <g v-for="tick in tickMarks" :key="tick.angle">
        <line
            :x1="tick.start.x"
            :y1="tick.start.y"
            :x2="tick.end.x"
            :y2="tick.end.y"
            :stroke="tick.major ? '#4a5568' : '#a0aec0'"
            :stroke-width="tick.major ? 2 : 1"
        />
        <text
            v-if="tick.major"
            :x="tick.label.x"
            :y="tick.label.y"
            font-size="12"
            text-anchor="middle"
            alignment-baseline="middle"
            class="text-foreground"
        >
          {{ formatValue(tick.value) }}
        </text>
      </g>

      <!-- Knob -->
      <circle
          :cx="knobPosition.x"
          :cy="knobPosition.y"
          r="8"
          :fill="color"
          stroke="white"
          stroke-width="2"
      />
    </svg>

    <!-- Current value display -->
    <div
        class="value-display cursor-pointer text-foreground"
        @mousedown="startDrag"
        @touchstart="startDrag"
    >
      {{ formatValue(displayValue) }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  minValue: {
    type: Number,
    default: 1
  },
  maxValue: {
    type: Number,
    default: 1000
  },
  size: {
    type: Number,
    default: 200
  },
  precision: {
    type: Number,
    default: 2
  },
  color: {
    type: String,
    default: '#4299e1'
  },
  reverse: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

// Refs
const angle = ref(0)
const isDragging = ref(false)
const displayValue = ref(props.minValue)
const svg = ref(null)

// Constants for the 240-degree arc, gap at bottom
const START_ANGLE = -210  // Start from right top
const END_ANGLE = 30     // End at left top
const ANGLE_RANGE = END_ANGLE - START_ANGLE

// Basic computed values
const center = computed(() => props.size / 2)
const radius = computed(() => (props.size / 2) * 0.8)

// Position calculations
const polarToCartesian = (angle) => {
  const angleRad = (angle * Math.PI) / 180
  return {
    x: center.value + radius.value * Math.cos(angleRad),
    y: center.value + radius.value * Math.sin(angleRad)
  }
}

const knobPosition = computed(() => polarToCartesian(angle.value))

const arcPath = computed(() => {
  const start = polarToCartesian(START_ANGLE)
  const end = polarToCartesian(angle.value)
  const largeArcFlag = Math.abs(angle.value - START_ANGLE) <= 180 ? 0 : 1

  return `M ${start.x} ${start.y} A ${radius.value} ${radius.value} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
})

// Value conversion functions
const linearToLog = (fraction) => {
  const adjustedFraction = props.reverse ? 1 - fraction : fraction

  // Handle zero-crossing ranges with simple linear interpolation
  if (props.minValue < 0 && props.maxValue > 0) {
    return props.minValue + (props.maxValue - props.minValue) * adjustedFraction
  }

  // For all-positive or all-negative ranges, use log scaling
  const minv = Math.log(Math.abs(props.minValue))
  const maxv = Math.log(Math.abs(props.maxValue))
  const value = Math.exp(minv + (maxv - minv) * adjustedFraction)
  return props.minValue < 0 ? -value : value
}

const logToLinear = (value) => {
  // Handle zero-crossing ranges with simple linear interpolation
  if (props.minValue < 0 && props.maxValue > 0) {
    const fraction = (value - props.minValue) / (props.maxValue - props.minValue)
    return props.reverse ? 1 - fraction : fraction
  }

  // For all-positive or all-negative ranges, use log scaling
  const minv = Math.log(Math.abs(props.minValue))
  const maxv = Math.log(Math.abs(props.maxValue))
  const fraction = (Math.log(Math.abs(value)) - minv) / (maxv - minv)
  return props.reverse ? 1 - fraction : fraction
}

const angleToFraction = (angle) => {
  return (angle - START_ANGLE) / ANGLE_RANGE
}

const fractionToAngle = (fraction) => {
  return START_ANGLE + (ANGLE_RANGE * fraction)
}

// Tick marks calculation
const tickMarks = computed(() => {
  const ticks = []
  const majorTicksCount = 5
  const minorTicksPerMajor = 4

  for (let i = 0; i <= majorTicksCount; i++) {
    const fraction = i / majorTicksCount
    const tickAngle = START_ANGLE + ANGLE_RANGE * fraction
    const value = linearToLog(fraction)

    ticks.push(createTick(tickAngle, value, true))

    if (i < majorTicksCount) {
      for (let j = 1; j <= minorTicksPerMajor; j++) {
        const minorFraction = (i + j / (minorTicksPerMajor + 1)) / majorTicksCount
        const minorAngle = START_ANGLE + ANGLE_RANGE * minorFraction
        const minorValue = linearToLog(minorFraction)

        ticks.push(createTick(minorAngle, minorValue, false))
      }
    }
  }

  return ticks
})

const createTick = (angle, value, major) => {
  const angleRad = (angle * Math.PI) / 180
  const innerRadius = radius.value - (major ? 10 : 5)
  const outerRadius = radius.value + (major ? 2 : 0)
  const labelRadius = radius.value + 20

  return {
    angle,
    value,
    major,
    start: {
      x: center.value + innerRadius * Math.cos(angleRad),
      y: center.value + innerRadius * Math.sin(angleRad)
    },
    end: {
      x: center.value + outerRadius * Math.cos(angleRad),
      y: center.value + outerRadius * Math.sin(angleRad)
    },
    label: {
      x: center.value + labelRadius * Math.cos(angleRad),
      y: center.value + labelRadius * Math.sin(angleRad)
    }
  }
}

const formatValue = (value) => {
  // Handle zero case
  if (value === 0) return '0'

  const absValue = Math.abs(value)

  // For very small numbers, use scientific notation
  if (absValue < 0.01) {
    return `${(value * 1000).toFixed(1)}m`
  }

  // For very large numbers, use scientific notation
  if (absValue >= 10000) {
    return `${(value / 1000).toFixed(1)}k`
  }

  // For numbers between 0.01 and 100, show more decimal places
  if (absValue < 100) {
    return value.toFixed(2)
  }

  // For larger numbers, show fewer decimal places
  return value.toFixed(1)
}

// Event handlers
const startDrag = (event) => {
  event.preventDefault()
  isDragging.value = true

  // Store last position
  let lastX = event.touches ? event.touches[0].clientX : event.clientX
  let lastY = event.touches ? event.touches[0].clientY : event.clientY

  const moveHandler = (e) => {
    if (isDragging.value) {
      const currentX = e.touches ? e.touches[0].clientX : e.clientX
      const currentY = e.touches ? e.touches[0].clientY : e.clientY

      // Calculate movement relative to last position
      const deltaX = currentX - lastX
      const deltaY = currentY - lastY

      // Update angle based on movement
      const sensitivity = 0.35
      let newAngle = angle.value + ((deltaX + -deltaY) * sensitivity)
      newAngle = Math.max(START_ANGLE, Math.min(END_ANGLE, newAngle))

      // Update value if angle changed
      if (newAngle !== angle.value) {
        angle.value = newAngle
        const fraction = angleToFraction(newAngle)
        displayValue.value = linearToLog(fraction)
        emit('update:modelValue', displayValue.value)
      }

      // Update last position
      lastX = currentX
      lastY = currentY
    }
  }

  const endHandler = () => {
    isDragging.value = false
    window.removeEventListener('mousemove', moveHandler)
    window.removeEventListener('mouseup', endHandler)
    window.removeEventListener('touchmove', moveHandler)
    window.removeEventListener('touchend', endHandler)
  }

  window.addEventListener('mousemove', moveHandler)
  window.addEventListener('mouseup', endHandler)
  window.addEventListener('touchmove', moveHandler)
  window.addEventListener('touchend', endHandler)
}

// Initialization and watchers
onMounted(() => {
  const fraction = logToLinear(props.modelValue)
  angle.value = fractionToAngle(fraction)
  displayValue.value = props.modelValue
})

watch(() => props.modelValue, (newValue) => {
  if (newValue !== displayValue.value) {
    const fraction = logToLinear(newValue)
    angle.value = fractionToAngle(fraction)
  }
})
</script>

<style scoped>
.log-dial {
  position: relative;
  display: inline-block;
}

.value-display {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.2em;
  font-weight: bold;
}

svg {
  user-select: none;
  touch-action: none;
}
</style>