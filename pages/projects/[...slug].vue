<script setup lang="ts">
import SpotlightButton from "../../components/SpotlightButton.vue";
import {definePageMeta, queryCollection, useRoute, createError} from "../../.nuxt/imports";

const backButtonClicked = ref(false)

const data = await queryCollection('projects')
    .path(useRoute().path)
    .first()

if (!data) {
  throw createError({
    statusCode: 404,
    message: 'Project not found'
  })
}

definePageMeta({
  pageTransition: {name: 'fade'},
  title: `Red Mountain Software // Work `
})
</script>

<template>
  <article class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Project Header -->
    <h1 class="text-3xl font-bold flex justify-around">
      <div>
        <NuxtLink class="hover:underline" :to="{name:'projects'}">Projects</NuxtLink>
        - {{ data.title }}
      </div>
    </h1>
    <div class="flex flex-col justify-center items-center">
      <Prose class="mb-12">
        <p class="mt-4 text-xl ">{{ data.description }}</p>
        <div class="mt-6  gap-2" v-if="data.meta.techStack?.length">
          <Tags :value="data.meta.techStack"/>
        </div>
      </Prose>

      <!-- Project Links -->
      <div v-if="data.meta.links" class="flex">
        <SpotlightButton
            v-if="data.meta.links.live"
            :to="data.meta.links.live"
            target="_blank"
        >
          View Live Site
        </SpotlightButton>
        <SpotlightButton
            v-if="data.meta.links.github"
            :to="data.meta.links.github"
        >
          View on GitHub
        </SpotlightButton>
      </div>


      <!-- Project Content -->
      <div class="flex flex-col items-center justify-center">
        <!-- Main Content -->
        <Prose class="">
          <ContentRenderer :value="data"/>
        </Prose>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Technical Details -->
          <div class=" rounded-lg py-6">
            <div v-if="data.meta.timeline" class="my-3">
              <dt class="text-sm  font-bold">Timeline</dt>
              <dd class="mt-1 text-sm ">{{ data.meta.timeline }}</dd>
            </div>
            <div v-if="data.meta.role" class="my-3">
              <dt class="text-sm font-bold">Role</dt>
              <dd class="mt-1 text-sm ">{{ data.meta.role }}</dd>
            </div>
          </div>
        </div>
      </div>
      <SpotlightButton :to="{name: 'projects'}" @click="backButtonClicked=true">
        Return
      </SpotlightButton>
    </div>
  </article>
</template>