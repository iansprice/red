<template>
  <div class="flex justify-around">
    <div class="navigation">
      <NuxtLink @click="goToPrev" :disabled="!hasPrevPage" class="m-6">
        <SpotlightButton>
          <Icon name="grommet-icons:previous" color="white" size="48"/>
        </SpotlightButton>
      </NuxtLink>
      <NuxtLink @click="goToNext" :disabled="!hasNextPage" class="m-6">
        <SpotlightButton>
          <Icon name="grommet-icons:next" color="white" size="48"/>
        </SpotlightButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  goToNextPageInFolder,
  goToPrevPageInFolder,
  hasNextPage,
  hasPrevPage,
  currentPage,
} = usePageNavigation()

function goToNext(): void {
  goToNextPageInFolder()
}

function goToPrev(): void {
  goToPrevPageInFolder()
}
</script>