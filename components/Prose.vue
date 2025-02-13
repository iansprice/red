<script setup lang="ts">
import {proseClasses} from "../utils/prose";
</script>

<template>
  <article :class="[proseClasses]">
    <slot/>
  </article>
</template>

<style scoped>

</style>