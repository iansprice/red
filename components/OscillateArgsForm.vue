<script setup lang="ts">
import {MathFunctions, type OscillateProps} from "../composables/useOscillate";

defineProps<{
  alwaysOn?: boolean
}>()
const modelValue = defineModel<OscillateProps>()
const options = Object.keys(MathFunctions)


function logScale(value: number, min: number = 0, max: number = 100) {
  // Handle edge cases
  if (value <= min) return 1;
  if (value >= max) return max;

  // Calculate log scale
  // Using Math.exp() to create exponential curve
  const minv = Math.log(1);  // Log of 1 = 0
  const maxv = Math.log(max + 1);  // Using 2501 to make max exactly 2500

  // Calculate scale
  const scale = (maxv - minv) / (max - min);

  return Math.round(Math.exp(minv + scale * (value - min)));
}

</script>

<template>
  <div class="border border-gray-700 px-3 py-2 gap-3">
    <div v-if="!alwaysOn" @click.stop class="cursor-pointer">
      <UToggle
          id="on"
          size="md"
          :class="['mx-3 mt-1', {'text-sage-100': !modelValue.on}]"
          v-model="modelValue.on"
      />
      <label for="on">Enable oscillator</label>
    </div>

    <div :class="['transition-opacity duration-100',{'opacity-50':!modelValue.on}]">
      <div>
        <label for="waveform">Waveform</label>
        <USelectMenu id="waveform" :disabled="!modelValue.on" v-model="modelValue.trigonometricFunction"
                     :options="options"/>
      </div>

      <div class="flex">
        <div class="flex flex-col">
          <LazyLogDial
              reverse
              v-model:model-value="modelValue.cycleLengthSeconds"
              :max-value="modelValue.max"
              :min-value="modelValue.min"
              :disabled="!modelValue.on"
              :size="120"
              :precision="2"
          />
          <label for="oscillation">Frequency</label>
          <div>{{ (1 / modelValue.cycleLengthSeconds).toFixed(3) }}hz</div>
        </div>
        <div class="flex flex-col">
          <LazyLogDial
              :disabled="!modelValue.on"
              v-model.number="modelValue.amplitudeRatio"
              :min-value="0.001"
              :max-value="1"
              :size="120"
              id="amplitudeRatio"
          />
          <label for="amplitudeRatio">Amplitude</label>
          <div>{{ modelValue.amplitudeRatio.toFixed(2) }}</div>
        </div>

        <div class="flex flex-col">
          <LazyLogDial
              :disabled="!modelValue.on"
              v-model.number="modelValue.skew"
              :min-value="-1"
              :max-value="1"
              :size="120"
          />
          <label for="skew">Skew amount</label>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>