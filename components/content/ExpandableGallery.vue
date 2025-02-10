<template>
  <div :class="cn('flex h-96 w-full gap-2', props.class)">
    <div
        v-for="image in images"
        :key="image.src"
        class="relative flex h-full flex-1 cursor-pointer overflow-hidden rounded-xl transition-all duration-500 ease-in-out hover:flex-[3]"
    >
      <ImageModal
          :src="image.src"
          :alt="image.alt"
          :caption="image.caption"
      >
        <img
            :src="image.src"
            :alt="image.alt"
            class="relative h-full object-cover"
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