<template>
  <div>
    <div class="z-50 absolute h-[90vh] w-screen flex flex-col justify-end " v-if="donezo">
      <NuxtLink to="~" class="group inline-block" @click="donezo=false">
        <button
            class="cursor-pointer text-xl px-3 py-2 border border-foreground rounded-lg top-6 ml-[60vw] group-hover:mt-1 group-hover:saturate-150 group-hover:bg-accent"
            style="background-color:#ad0000">
          This way
          <Icon name="fa-solid:mountain"
                class="transition-transform duration-500 ease-out group-hover:rotate-[450deg] color-danger-500"/>
        </button>
      </NuxtLink>
    </div>
    <div class="flex h-screen w-screen absolute top-0 left-0 place-items-center" v-if="!donezo">
      <LazyUiHyperText
          :class="['text-2xl z-10 -top-12 opacity-100', {'opacity-0':donezo}]"
          text="LOADING..."
          :duration="duration"
          animate-on-load
      />
    </div>
    <NuxtLayout name="grid" v-else class="z-100">
      <div class="!h-screen !w-screen overflow-hidden overscroll-none !cursor-pointer pointer-events-none">
        <LazyUiVideoText
            src="https://www.youtube.com/embed/trlNB_VIWNY?si=6A8mZJFC4NIUI8Y5"
            :class="['text-2xl w-screen cursor-pointer opacity-0 transition-opacity duration-1000',{'opacity-100 h-screen':donezo}]"
            :autoPlay="true"
            font-family="monospace"
            loop
            :start="1832"
            @click.stop
        >
          {{ statement }}
        </LazyUiVideoText>
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import {Ref, ref} from 'vue';
import {navigateTo} from "nuxt/app";

const hideIt = ref(false)
const duration = 2500
const donezo = ref(false)
onMounted(() => setTimeout(() => donezo.value = true, duration))

const statements = [
  'HELLO', "I'm Ian", "THanks for visiting", "...", "YUou know", "I'm accepting clients/Work",
  "Great, huh?", "Lucky you", "....", "This could by YOUR site",
  ".....", "Websites look pretty-samesame right-now",
  "Thought this shouldn't", "......", "Anyways", 'I only_build things-I love',
  'Build-in your-image they-say', ' ~ ', ':~)', ''
]
const statement = ref()

let index = statements.length
useIntervalFn(() => {
  if (index + 1 >= statements.length) {
    index = 0
  } else {
    index++
  }
  statement.value = statements[index]
}, 4500)

</script>

<style>
</style>