<template>
  <article class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Project Header -->
    <Prose class="mb-12">
      <h1 class="text-4xl font-bold ">{{ data.title }}</h1>
      <p class="mt-4 text-xl ">{{ data.description }}</p>
      <div class="mt-6 flex flex-wrap gap-2">
        <Tags :value="data.tags"/>
      </div>
    </Prose>

    <!-- Project Links -->
    <Prose v-if="data.links" class="mb-12 flex gap-4">
      <a
          v-if="data.links.live"
          :href="data.links.live"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-4 py-2 border border-transparent  font-medium rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700"
      >
        View Live Site
      </a>
      <a
          v-if="data.links.github"
          :href="data.links.github"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center px-4 py-2 border border-gray-300  font-medium rounded-md  bg-white hover:bg-gray-50"
      >
        View on GitHub
      </a>
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
        <div class="shadow rounded-lg py-6">
          <h2 class="text-xl font-semibold  mb-4">Technical Details</h2>
          <dl class="space-y-4">
            <div v-if="data.techStack">
              <dt class="text-sm font-medium ">Tech Stack</dt>
              <dd class="mt-1 text-sm ">
                <ul class="list-disc pl-4">
                  <li v-for="tech in data.techStack" :key="tech">{{ tech }}</li>
                </ul>
              </dd>
            </div>
            <div v-if="data.timeline">
              <dt class="text-sm font-medium ">Timeline</dt>
              <dd class="mt-1 text-sm ">{{ data.timeline }}</dd>
            </div>
            <div v-if="data.role">
              <dt class="text-sm font-medium ">Role</dt>
              <dd class="mt-1 text-sm ">{{ data.role }}</dd>
            </div>
          </dl>
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
  </article>
</template>

<script setup lang="ts">
import {Ref} from "vue";

interface Project {
  _id: string
  title: string
  description: string
  tags: string[]
  links?: {
    live?: string
    github?: string
  }
  techStack?: string[]
  timeline?: string
  role?: string
  keyFeatures?: string[]
}

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
</script>