<template>
  <div :class="cn('flex h-96 gap-2 my-24 not-prose relative -mx-[50vw] left-[50%] right-[50%] w-screen', props.class)">
    <div
        v-for="image in images"
        :key="image.src"
        class="relative flex !w-[calc(100vw/3)] h-full flex-1 cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ease-in-out hover:flex-[3]"
    >
      <ImageModal
          :src="image.src"
          :alt="image.alt"
          :caption="image.caption"
          class=" w-full"
      >
        <img
            :src="image.src"
            :alt="image.alt"
            class="relative h-full object-cover object-top w-full"
        />
      </ImageModal>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {HTMLAttributes} from "vue";
import {cn} from "../../lib/utils";
import ImageModal from "../ui/ImageModal.vue";

type Image = {
  src: string;
  alt: string;
  caption: string;
}

interface Props {
  images: Image[];
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>