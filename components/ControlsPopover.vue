<script setup lang="ts">

  withDefaults(defineProps<{
    label?: string
  }>(), {
    label: 'Controls'
  })
</script>

<template>
  <UPopover
      class="z-10 pointer-events-auto fixed bottom-4 left-4"
      :ui="{strategy: 'override'}"
  >
    <template #default="{open}">
      <UButton
          :class="['z-10 pointer-events-auto']"
          color="white"
          :label="label"
      >
        <template #trailing="{}">
          <UIcon name="i-heroicons-chevron-up-20-solid" :class="{'rotate-180': open}"/>
        </template>
      </UButton>
    </template>
    <template #panel="{close}">
      <div class="flex flex-wrap bg-transparent z-10 pointer-events-auto">
        <slot name="default"/>
      </div>
    </template>
  </UPopover>
</template>

<style scoped>

</style>