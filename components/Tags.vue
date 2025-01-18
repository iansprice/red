<script setup lang="ts">

const props = defineProps<{value: string[]}>()

const emit = defineEmits<{
  click: [tag: string]
}>()

const tags = computed(() => (props.value||[]).filter(tag => !!tag))

const onClick = (tag: string) => emit('click', tag)
</script>

<template>
  <div class="flex flex-row space-x-2 my-3" v-if="tags?.length > 0">
    <button
        class="bg-blue-400 text-white px-1.5 py-0.5 text-md"
        v-for="tag in tags"
        :key="tag"
        @click="() => onClick(tag)"
    >
      {{tag}}
    </button>
  </div>
</template>

<style scoped>

</style>