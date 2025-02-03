<template>
  <article class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Project Header -->
    <h1 class="text-3xl font-bold text-center"><NuxtLink class="hover:underline" :to="{name:'projects'}">Projects</NuxtLink> - {{ data.title }}</h1>
    <Prose class="mb-12">
      <p class="mt-4 text-xl ">{{ data.description }}</p>
      <div class="mt-6 flex flex-wrap gap-2" v-if="data.techStack?.length">
        <Tags :value="data.techStack"/>
      </div>
    </Prose>

    <!-- Project Links -->
    <Prose v-if="data.links" class="mb-12 flex gap-4">
      <SpotlightButton
          v-if="data.links.live"
          :to="data.links.live"
      >
        View Live Site
      </SpotlightButton>
      <SpotlightButton
          v-if="data.links.github"
          :to="data.links.github"
      >
        View on GitHub
      </SpotlightButton>
    </Prose>

    <!-- Project Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Main Content -->
      <Prose class="lg:col-span-2 max-w-none">
        <ContentDoc/>
      </Prose>

      <!-- Sidebar -->
      <div class="space-y-8">
        <!-- Technical Details -->
        <div class=" rounded-lg py-6">
          <div v-if="data.timeline" class="my-3">
            <dt class="text-sm  font-bold">Timeline</dt>
            <dd class="mt-1 text-sm ">{{ data.timeline }}</dd>
          </div>
          <div v-if="data.role" class="my-3">
            <dt class="text-sm font-bold">Role</dt>
            <dd class="mt-1 text-sm ">{{ data.role }}</dd>
          </div>
        </div>

        <!-- Key Features -->
        <div v-if="data.keyFeatures" class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold  mb-4">Key Features</h2>
          <ul class="space-y-2">
            <li
                v-for="feature in data.keyFeatures"
                :key="feature"
                class="flex items-start"
            >
              <span class="flex-shrink-0 h-5 w-5">✓</span>
              <span class="ml-2">{{ feature }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <SpotlightButton :to="{name: 'projects'}" @click="backButtonClicked=true">
      Return
    </SpotlightButton>
  </article>
</template>

<script setup lang="ts">
import {type Ref} from "vue";
import SpotlightButton from "../../components/SpotlightButton.vue";
import {type Project} from "../../types/types";
import {definePageMeta} from "../../.nuxt/imports";

const backButtonClicked = ref(false)

const {data}: { data: Ref<Project> } = await useAsyncData('project', () =>
    queryContent()
        .where({_path: useRoute().path})
        .findOne()
)

if (!data.value) {
  throw createError({
    statusCode: 404,
    message: 'Project not found'
  })
}

definePageMeta({
  pageTransition: {name: 'fade'},
  title: `Red Mountain Software // Work // `
})
</script>