  <script setup lang="ts">

  const props = defineProps<{value: string[]}>()

  const emit = defineEmits<{
    click: [tag: string]
  }>()

  const tags = computed(() => (props.value||[]).filter(tag => !!tag))

  const onClick = (tag: string) => emit('click', tag)
  </script>

  <template>
    <div class="flex flex-row flex-wrap gap-2 my-3" v-if="tags?.length > 0">
      <button
          class="bg-gray-700/60 hover:bg-gray-600 transition-opacity duration-200 text-white px-1.5 py-0.5 text-md hover:scale-105 transition-transform duration-200 rounded-md"
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