<script setup lang="ts">
import {MathFunctions, type OscillateProps} from "../composables/useOscillate";

const modelValue = defineModel<OscillateProps>()
const options = Object.keys(MathFunctions)
</script>

<template>
  <div>
    <div>
      <div>
        <label for="on">Enabled</label>
      </div>
      <UToggle
          id="on"
          :class="{'text-sage-100': !modelValue.on}"
          v-model="modelValue.on"
      />
    </div>
    <label for="oscillation">Cycle length</label>
    <URange
        :disabled="!modelValue.on"
        v-model.number="modelValue.cycleLengthSeconds"
        type="range"
        :min="modelValue.min"
        :max="modelValue.max"
        :step="0.001"
        id="oscillation"
    />
    <span>{{ modelValue.cycleLengthSeconds }}s cycle length</span>
    <USelectMenu :disabled="!modelValue.on" v-model="modelValue.trigonometricFunction" :options="options" />
    <label for="amplitudeRatio">Amplitude</label>
    <URange
        :disabled="!modelValue.on"
        v-model.number="modelValue.amplitudeRatio"
        :min="0.0001"
        :max="1"
        :step="0.0001"
        id="amplitudeRatio"
    />

    <label for="skew">Skew amount</label>
    <URange
        :disabled="!modelValue.on"
        v-model.number="modelValue.skew"
        :min="-1"
        :max="1"
        :step="0.001"
    />

    <label for="centerPhase">Center phase</label>
    <UToggle
      :disabled="!modelValue.on"
      v-model="modelValue.centerPhase"
    />
  </div>
</template>

<style scoped>

</style>