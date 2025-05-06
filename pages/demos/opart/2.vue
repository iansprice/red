<script setup>
import useOscillate from "../../../composables/useOscillate";
import {ref, computed, onMounted, onUnmounted} from "vue";

const w1 = ref(.5); // Initial oscillation value
const o1 = ref(0.01)

const w2 = ref(1)
const o2 = ref(.2)

// Oscillation function configuration
const {assignValueOnLoop} = useOscillate({
  max: 5, // Moves fully across a cell
  min: 0, // Allows overlap across cells
  trigonometricFunction: "Sin",
  cycleLengthSeconds: 10,
  autoStart: true,
  centerPhase: true,
  amplitudeRatio: 1,
  skew: 0,
  on: true,
});
assignValueOnLoop(w1, o1);

const {assignValueOnLoop: assignValueOnLoop2} = useOscillate({
  max: 29, // Moves fully across a cell
  min: 0, // Allows overlap across cells
  trigonometricFunction: "Bounce",
  cycleLengthSeconds: 5,
  autoStart: true,
  centerPhase: true,
  amplitudeRatio: 1,
  skew: 0.4,
  on: true,
});
assignValueOnLoop2(w2, o2);


// Compute the dynamically changing points
const points1 = computed(() => {
  const a = 0
  const b = o1.value
  return `${a},${b} ${20 - a},${b -20} ${10 - a},${b - 20} ${a},${b - 10}`;
});
</script>

<template>
  <div class="flex flex-col items-center">
    {{w1}} > {{Math.round(o1, -2)}}
    <LogDial
        :min-value="0.001"
        :max-value="50"
        :size="120"
        :sub-value="o1"
        v-model="w1"
    />
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
      <!-- Frame -->
      <rect x="0" y="0" width="500" height="500" fill="black"/>

      <!-- Outer Background -->
      <rect x="50" y="50" width="400" height="400" fill="white"/>

      <!-- Outer Stripes -->
      <pattern id="outerStripes" patternUnits="userSpaceOnUse" :width="o1" :height="w1">
        <rect x="0" y="0" width="40" height="80" fill="white"/>
        <polygon id="outerPolygon" :points="points1" fill="black"/>
      </pattern>
      <rect x="50" y="50" width="400" height="400" fill="url(#outerStripes)"/>

      <!-- Inner Background -->
      <polygon points="100,100 400,100 400,400 200,400 100,300" fill="blue" fill-opacity="0.05"/>

      <!-- Inner Stripes -->
      <pattern id="innerStripes" patternUnits="userSpaceOnUse" width="20" :height="o2">
        <rect x="0" y="0" width="20" height="20" fill="white" fill-opacity="0.01"/>
        <polygon :points="`0,0 ${w1},20 15,${o1} 0,5`" />
      </pattern>
      <polygon :points="`100,${o1**1.3} 400,100 ${w2*10},${o2*10} 200,400 ${w1},300`" fill="url(#innerStripes)"/>
    </svg>
  </div>
</template>
