<!-- ImageModal.vue -->
<template>
  <div>
    <!-- Custom trigger slot -->
    <span @click="open=true">
      <slot name="default" />
    </span>

    <!-- Modal -->
    <UModal v-model="open" fullscreen>
      <UCard>
        <!-- Modal Header -->
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium">{{ title }}</h3>
            <UButton
                icon="i-heroicons-x-mark"
                color="gray"
                variant="ghost"
                @click="open = false"
            />
          </div>
        </template>

        <!-- Modal Body -->
        <div class="flex justify-center">
          <img
              :src="src"
              :alt="alt"
              class="max-w-full max-h-[80vh] object-contain"
          />
        </div>

        <!-- Modal Footer -->
        <template #footer>
          <p v-if="caption" class="text-sm text-foreground">{{ caption }}</p>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  title?: string
  caption?: string
}

withDefaults(defineProps<Props>(), {
  alt: 'Image',
  title: 'Image Preview',
  caption: ''
})

const open = defineModel('open', {default: false})
</script>