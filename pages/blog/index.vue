<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="flex flex-col space-y-3">
      <span class="text-3xl font-bold ">{{ feed.title }}</span>
      <img
          :src="feed.image"
          :alt="feed.description"
          class="w-8 h-8 mr-2"
      />
    </div>

    <Tags :value="tags"/>

    <div class="my-6">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-8">
        <p class="">Loading posts...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 p-4">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <!-- Posts grid -->
      <div v-else class="grid gap-8 md:grid-cols-2">
        <article
            v-for="post in posts"
            :key="post.id"
            class="border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <NuxtLink
              :href="post.link"
              target="_blank"
              class="inline-block"
          >
            <img
                :src="getFirstImageSrc(post.description)"
                :alt="post.title"
                class="w-full h-48 object-cover"
            />
            <div class="p-6">
              <h2 class="text-xl font-semibold mb-2">{{ post.title }}</h2>
              <p class=" mb-4 line-clamp-3">{{ post.subtitle }}</p>
              <div class="flex items-center justify-between">
                <p class="text-sm ">
                  {{ formatDate(post.pubDate) }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouteQuery} from '@vueuse/router'

const tags = useRouteQuery('tag', "", {
  transform: Array,
})

const feed = ref({})
const posts = ref([])
const loading = ref(true)
const error = ref(null)

const config = useRuntimeConfig()
// Replace with your Medium API credentials
const USERNAME = config.public.mediumUsername

function getFirstImageSrc(htmlContent) {
  // Regular expression to match img tag and capture the src attribute
  const imgRegex = /<img[^>]+src="([^"]+)"/i;

  // Try to find a match
  const match = htmlContent.match(imgRegex);

  // Return the captured src URL or null if no match found
  return match ? match[1] : null;
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchPosts = async () => {
  try {
    loading.value = true
    error.value = null

    // Medium's API endpoint (you'll need to sign up for API access)
    const response = await $fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${USERNAME}`, {})
    console.log({response})

    // Transform the API response into our desired format
    posts.value = response.items
    feed.value = response.feed
  } catch (err) {
    error.value = 'Failed to load blog posts. Please try again later.'
    console.error('Error fetching Medium posts:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchPosts)
</script>