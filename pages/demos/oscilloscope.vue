<script setup lang="ts">
import {type ShallowRef} from "vue";

const dark = useDark()
const fillColor = ref('#39FF14')

const {oscillate, oscillateArgs} = useOscillate({
  max: 100,
  min: 0.004,
  trigonometricFunction: "Sin",
  cycleLengthSeconds: 5,
  skew: 0,
  on: true,
  amplitudeRatio: 1.0,
  centerPhase: false,
})

const delayRaw = ref(1)

const checkOsc = () => {
  if (oscillateArgs.on) {
    delayRaw.value = oscillate()
  }
}

let timerId;

onMounted(() => {
  timerId = setInterval(() => {
    checkOsc();
  }, 10);
});

onUnmounted(() => {
  clearInterval(timerId); // Clear the interval when the component is unmounted
});

const oscillatorTimeWindow = ref(5)
</script>

<template>
  <div>
    <div class="flex flex-auto justify-around">
      <div >
        <OscillateArgsForm class="flex flex-col " v-model="oscillateArgs" >
          <div>
            <label for="color">Color</label>
            <input type="color" v-model="fillColor" id="color"/>
          </div>
        </OscillateArgsForm>
      </div>
    </div>
    <div class="flex justify-end">
      <div class="grow">
        <Oscilloscope
            :value="delayRaw"
            :center-phase="oscillateArgs.centerPhase"
            :min="oscillateArgs.min"
            :max="oscillateArgs.max"
            :stroke="fillColor"
            :time-window="oscillatorTimeWindow"
            :max-points="50000"
        >
          <URange
              v-model.number="oscillatorTimeWindow"
              :min="0.004"
              :max="100"
              :step="0.001"
          />
        </Oscilloscope>
      </div>
      <div class="shrink">
          <URange
              v-model.number="delayRaw"
              :disabled="oscillateArgs.on"
              id="value"
              :max="100"
              :min="0"
              :step=".01"
              class="-rotate-90 -ml-[100px] -mr-[100px] h-64 mt-22 w-96"
              :style="`color:${fillColor};`"
          />
      </div>
    </div>
  </div>
</template>

<style scoped>
.odd {
  animation: float 10s ease-in-out infinite;
}

.even {
  animation: ripple-wave 12.5s ease-in-out infinite;
}

.ripple-wave {
  transform-origin: center;
  animation: ripplePath 2s ease-out infinite;
  opacity: 1;
}

.ripple-wave-delayed {
  transform-origin: center;
  animation: ripplePath 2s ease-out 1s infinite;
  opacity: 1;
}

@keyframes ripplePath {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

@keyframes opacitize {
  0%, 100% {
    opacity: 1;
  }
  60% {
    opacity: 0.9;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scaleX(100%);
  }
  25% {
    transform: translateY(-160px) scaleX(100%);
  }
  50% {
    transform: translateY(0) scaleX(100%);
  }
  75% {
    transform: translateY(160px) scaleX(100%);
  }
}
</style>