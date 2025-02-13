  <script setup lang="ts">

  import Tag from "./Tag.vue";

  const props = defineProps<{value: string[]}>()

  const emit = defineEmits<{
    click: [tag: string]
  }>()

  const tags = computed(() => (props.value||[]).filter(tag => !!tag))

  const onClick = (tag: string) => emit('click', tag)
  </script>

  <template>
    <div class="flex flex-row flex-wrap gap-2 my-3" v-if="tags?.length > 0">
      <Tag
          v-for="tag in tags"
          :key="tag"
          :value="tag"
          @click="() => onClick(tag)"
      />
    </div>
  </template>

  <style scoped>

  </style>