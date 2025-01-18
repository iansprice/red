<script setup lang="ts">
const socials = ['Twitter', 'Instagram', 'YouTube']
</script>

<template>
  <footer class="bg-dune-900/95 dark:bg-twilight-900/95 backdrop-blur-sm mt-20 ">
    <Prose class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid md:grid-cols-3 gap-8 text-dune-100">
        <div>
          <h4 class="font-display text-horizon-300 dark:text-horizon-400 text-lg">About</h4>
          <p class="mt-4 text-dune-300 dark:text-dune-200 leading-relaxed">
            Embracing the serene beauty of desert twilight,
            where every color tells a story of nature's transition.
          </p>
        </div>
        <div>
          <h4 class="font-display text-sage-300 dark:text-sage-400 text-lg">Contact</h4>
          <p class="mt-4 text-dune-300 dark:text-dune-200 leading-relaxed">
            Reach out to us at the edge of the horizon,
            where dreams meet reality.
          </p>
        </div>
        <div>
          <h4 class="font-display text-twilight-300 dark:text-twilight-400 text-lg">Follow</h4>
          <div class="mt-4 space-x-4">
            <a v-for="social in socials"
               :key="social"
               href="#"
               class="text-dune-300 hover:text-horizon-300
                        dark:text-dune-200 dark:hover:text-horizon-400
                        transition-colors">
              {{ social }}
            </a>
          </div>
        </div>
      </div>
    </Prose>
  </footer>
</template>

<style scoped>

</style>