// nuxt.config.ts
import {defineNuxtConfig} from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-26',
  app: {
    head: {
      title: 'Red Mountain Software',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'My Professional Portfolio' }
      ]
    }
  },
  css: [
    '~/assets/css/animations.css',
    '~/assets/css/fonts.css',
  ],
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@vueuse/nuxt', ],
  nitro: {
    prerender: {
      autoSubfolderIndex: false
    }
  },
  runtimeConfig: {
    public: {
      mediumAPIKey: process.env.MEDIUM_API_KEY,
      mediumUsername: process.env.MEDIUM_USERNAME
    }
  },
  typescript: {
    strict: false
  },
})