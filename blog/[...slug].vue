// pages/blog/[...slug].vue
<template>
  <article class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <Prose class="mx-auto">
      <!-- Blog Post Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-4">{{ data.title }}</h1>
        <div class="">
          {{ new Date(data.date).toLocaleDateString() }}
        </div>
      </div>
      <!-- Blog Post Content -->
      <ContentRenderer :  />
    </Prose>
  </article>
</template>

<script setup>
// Fetch the current page data
const params = useRoute().params
const queryContent = useContent()
const { data } = await useAsyncData('post:'+params.slug, () =>
    queryContent()
        .where({ _path: useRoute().path })
        .findOne()
)

// Handle 404
if (!data.value) {
  throw createError({
    statusCode: 404,
    message: 'Blog post not found'
  })
}
</script>