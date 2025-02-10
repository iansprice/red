<script setup lang="ts">
import SpotlightButton from "../../components/SpotlightButton.vue";
import {definePageMeta, queryCollection, useRoute, createError} from "../../.nuxt/imports";
import TextGenerateEffect from "../../components/ui/TextGenerateEffect.vue";
import LampEffect from "../../components/ui/LampEffect.vue";
import LinkPreview from "../../components/ui/LinkPreview.vue";

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

const titleAnimDone = ref(false)
</script>

<template>
  <article class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
    <div class="flex flex-col items-center">
      <Prose>
        <div class="flex flex-col flex-wrap justify-start not-prose">
            <NuxtLink class="shrink no-underline hover:underline not-prose opacity-60 hover:opacity-100 transition-opacity duration-200" :to="{name:'projects'}">
              <h2 class="text-3xl">Work</h2>
            </NuxtLink>
            <TextGenerateEffect
                tag="h2"
                class="text-3xl grow not-prose"
                :words="data.title"
                :delay="0"
                @done="titleAnimDone=true"/>
          <div
              class="my-1 mb-3 text-xl text-primary not-prose"
          >
            <TextGenerateEffect
                tag="h4"
                class=""
                :active="titleAnimDone"
                :words="data.description"
                :delay="500"
            />
          </div>
        </div>
        <div class="my-3 gap-2" v-if="data.meta.techStack?.length">
          <Tags :value="data.meta.techStack"/>
        </div>
        <div v-if="data.meta.links" class="my-3">
          <SpotlightButton
              v-if="data.meta.links.live"
              :to="data.meta.links.live"
              target="_blank"
          >
            View Live Site
            <Icon name="times"/>
          </SpotlightButton>
          <SpotlightButton
              v-if="data.meta.links.github"
              :to="data.meta.links.github"
          >
            View on GitHub
          </SpotlightButton>
        </div>

        <ContentRenderer :value="data" class="mt-6"/>

        <div class="space-y-8 text-left w-full">
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
      </Prose>

      <SpotlightButton :to="{name: 'projects'}" @click="backButtonClicked=true">
        Return
      </SpotlightButton>
    </div>
  </article>
</template>