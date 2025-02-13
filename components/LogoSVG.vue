<script setup>
import DisplacementCircles from "./filters/DisplacementCircles.vue";

const initial = 53
const it = ref(initial)
const {oscillate} = useOscillate({
  max: 100,
  min: 40,
  trigonometricFunction: "Sin",
  cycleLengthSeconds: 20,
  skew: 0,
  on: false,
  amplitudeRatio: 1.0,
  centerPhase: false,
})

const seed = ref(100)
const {oscillate: oscillate2} = useOscillate({
  max: 50,
  min: 10,
  trigonometricFunction: "Sin",
  cycleLengthSeconds: 11,
  skew: 0,
  on: false,
  amplitudeRatio: 1.0,
  centerPhase: false,
})

const orf = ref(100)
const {oscillate: oscillate3} = useOscillate({
  max: 5,
  min: 2,
  trigonometricFunction: "Sin",
  cycleLengthSeconds: 32,
  skew: 0,
  on: false,
  amplitudeRatio: 1.0,
  centerPhase: false,
})

const in1 = ref(100)
const {oscillate: oscillate4} = useOscillate({
  max: .0002,
  min: .00085,
  trigonometricFunction: "Sin",
  cycleLengthSeconds: 48,
  skew: 0,
  on: false,
  amplitudeRatio: 1.0,
  centerPhase: false,
})

const in2 = ref(100)
const {oscillate: oscillate5} = useOscillate({
  max: .004,
  min: .0001,
  trigonometricFunction: "Sin",
  cycleLengthSeconds: 29,
  skew: 0,
  on: false,
  amplitudeRatio: 1.0,
  centerPhase: false,
})
const in3 = ref(100)
const {oscillate: oscillate6} = useOscillate({
  max: 1,
  min: .051,
  trigonometricFunction: "Bounce",
  cycleLengthSeconds: 4,
  skew: 0,
  on: false,
  amplitudeRatio: 1.0,
  centerPhase: false,
})

let timerId;

onMounted(() => {
  timerId = setInterval(() => {
    it.value = oscillate()
    seed.value = oscillate2()
    orf.value = oscillate3()
    in1.value = oscillate4()
    in2.value = oscillate5()
    in3.value = oscillate6()
  }, 17);
});

onUnmounted(() => {
  clearInterval(timerId); // Clear the interval when the component is unmounted
});

</script>

<template>
  <div class="scale-125">
    <transition name="zoom">
      <NuxtLink
          class="z-50 pointer-events-auto flex flex-col justify-center items-center  md:scale-100 lg:scale-110 mt-3 hover:backdrop-saturate-110 hover:brightness-75"
          :to="{name:'~'}"
          style="z-index: 50; pointer-events: auto; isolation: isolate; position: relative;"
      >
        <svg class="w-full ml-12" viewBox="0 0 600 100">
          <defs>
            <DisplacementCircles id="dis1" :it="it" :octaves="orf" :in1="in1" :in2="in2" :in3="in3"/>
            <animate
                attributeName="stroke-width"
                values="1;2;1"
                dur="1s"
                :repeatCount="orf"
            />
          </defs>
          <g filter="url(#dis1)">
            <text x="0vw"
                  y="28"
                  class="animate-[fade-in_0.25s_ease-in_forwards_0.5s]"
                  text-anchor="start"
                  dominant-baseline="middle"
                  font-family="Arial Black, Arial, sans-serif"
                  font-weight="900"
                  font-size="57px"
                  fill="#db4740">
              RED MOUNTAIN
            </text>
          </g>
        </svg>
      </NuxtLink>
    </transition>
  </div>
</template>

<style scoped>

</style>