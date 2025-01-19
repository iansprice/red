<script setup lang="ts">
const hovered = ref(false)
</script>

<template>
      <div
          @mouseover="hovered=true"
          :class="['transition-all duration-500 ease-in-out cursor-pointer', 
          {'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen rounded-none z-50':hovered}]"
      >
        <slot/>
      </div>
</template>