// nuxt.config.ts
import {defineNuxtConfig} from "nuxt/config";

export default defineNuxtConfig({
    compatibilityDate: '2024-11-26',
    alias: {
        "~": ".",
    },
    app: {
        pageTransition: {name: 'fade', mode: 'out-in'},
        head: {
            title: 'Red Mountain Software',
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {hid: 'description', name: 'description', content: 'My Professional Portfolio'}
            ]
        },
    },
    css: [
        '@/assets/css/animations.css',
        '@/assets/css/fonts.css',
        '@/assets/css/transitions.css',
    ],
    devtools: {enabled: true},
    experimental: {
        payloadExtraction: false,
    },
    modules: [
        '@nuxt/content',
        '@nuxt/ui',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/color-mode',
        '@vueuse/nuxt',
        '@tresjs/nuxt',
    ],
    nitro: {
        prerender: {
            autoSubfolderIndex: false
        }
    },
    plugins: ['@/plugins/tres.client.ts'],
    runtimeConfig: {
        public: {
            mediumAPIKey: process.env.MEDIUM_API_KEY,
            mediumUsername: process.env.MEDIUM_USERNAME
        }
    },
    tres: {
        devtools: true,
        glsl: true,
    },
    typescript: {
        strict: false
    },
    ui: {
        global: false,
        primary: 'blue',
        gray: 'cool'
    }
})