<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex flex-col space-y-3">
      <span class="text-3xl font-bold ">Something</span>
    </div>

    <Tags v-if="tags?.length" :value="tags"/>

    <div class="my-6">
      <!-- Posts grid -->
      <div class="grid gap-8 md:grid-cols-2">
        <NuxtLink
            v-for="post in posts"
            :key="post.path"
            :to="post.path"
            class="border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div
              class="inline-block"
          >
            <img
                v-if="post.image"
                :src="post.image"
                :alt="post.title"
                class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
              <p v-if="post.subtitle" class=" mb-4 line-clamp-3">{{ post.subtitle }}</p>
              <div class="flex items-center justify-between">
                <p class="text-sm" v-if="post.date">
                  {{ formatDate(post.date) }}
                </p>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <UPagination :total="totalPosts" :model-value="page" :page-count="limitCt"/>
  </div>
</template>

<script setup>
import {useRouteQuery} from '@vueuse/router'
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const limitCt = 5
const tags = useRouteQuery('tag', "", {
  transform: Array,
})
const page0 = useRouteQuery('page', 0, {transform: Number})
const page = ref(page0 + 1)
const posts = await queryCollection('blog').skip(page * limitCt).limit(limitCt).all()
const totalPosts = await queryCollection('blog').count('path')
</script>