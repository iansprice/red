<script setup lang="ts">
import SpotlightButton from "../../components/SpotlightButton.vue";
import {definePageMeta, queryCollection, useRoute, createError} from "../../.nuxt/imports";
import TextGenerateEffect from "../../components/ui/TextGenerateEffect.vue";
import {proseClasses} from "../../utils/prose";

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

const titleAnimDone = ref(false)
const descAnimDone = ref(false)
</script>

<template>
  <article>
    <div class="flex flex-col items-center">
      <div class="flex flex-col flex-wrap justify-start">
        <Prose class="">
          <NuxtLink
              class="shrink text-primary hover:underline not-prose opacity-60 hover:opacity-100 transition-opacity duration-200 my-1"
              :to="{name:'projects'}">
            <h2 class="text-3xl w-fit">Work:</h2>
          </NuxtLink>
          <TextGenerateEffect
              tag="h2"
              class="text-3xl grow not-prose my-1"
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
                @done="descAnimDone=true"
            />
          </div>
          <div class="my-1 gap-2" v-if="data.meta.techStack?.length">
            <TextGenerateEffect
                class="w-full !max-w-[65ch]"
                :words="data.meta.techStack.join(' ')"
                :active="titleAnimDone"
                :delay="1000"
            >
              <template #word="{word}">
                <Tag :value="word" class="mr-2"/>
              </template>
            </TextGenerateEffect>
          </div>
          <div v-if="data.meta.links" class="my-3 w-full !max-w-[65ch]">
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
        </Prose>
      </div>
      <ContentRenderer :value="data" :class="proseClasses" prose/>
      <div class="flex justify-center items-center">
        <SpotlightButton :to="{name: 'projects'}" @click="backButtonClicked=true" class="mt-12">
          Return
        </SpotlightButton>
      </div>
    </div>
  </article>
</template>