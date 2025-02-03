<script setup lang="ts">
const props = defineProps({
  inOnly: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <Transition
      enter-from-class="translate-y-[30px] opacity-0"
      enter-active-class="transition duration-100"
      :leave-to-class="props.inOnly ? '' : `-translate-y-[30px] opacity-0`"
      :leave-active-class="props.inOnly ? '' : 'transition duration-100'"
  >
    <slot />
  </Transition>
</template>

<style scoped></style>
