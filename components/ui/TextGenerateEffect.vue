<template>
  <div :class="cn('leading-snug tracking-wide', props.class)">
    <Component :is="tag" ref="scope">
      <span
          v-for="(word, idx) in wordsArray"
          :key="word + idx"
          class="inline-block"
          :style="spanStyle"
      >
        {{ word }}&nbsp;
      </span>
    </Component>
  </div>
</template>

<script setup lang="ts">
import {computed, type HTMLAttributes, onMounted, ref} from "vue";

import {cn} from "../../lib/utils";

const props = withDefaults(
    defineProps<{
      words: string;
      filter?: boolean;
      duration?: number;
      delay?: number;
      class: HTMLAttributes["class"];
      active?: boolean,
      tag?: string,
    }>(),
    {duration: 0.7, delay: 0, filter: true, active: true, tag: 'div'},
);
const {active} = toRefs(props)

const scope = ref(null);
const wordsArray = computed(() => props.words.split(" "));

const spanStyle = computed(() => ({
  opacity: 0,
  filter: props.filter ? "blur(10px)" : "none",
  transition: `opacity ${props.duration}s, filter ${props.duration}s`,
}));

const emit = defineEmits<{
  done: [boolean]
}>()

onMounted(() => {
  watch(active,
      (a) => {
        if (a && scope.value) {
          const spans = (scope.value as HTMLElement).querySelectorAll("span");

          setTimeout(() => {
            spans.forEach((span: HTMLElement, index: number) => {
              setTimeout(() => {
                span.style.opacity = "1";
                span.style.filter = props.filter ? "blur(0px)" : "none";
              }, index * 200);
              setTimeout(() => emit('done', true), spans.length * 200)
            });
          }, props.delay);
        }
      }, {immediate: true});
})

</script>