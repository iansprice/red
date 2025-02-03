import TresJS from '@tresjs/core'
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(TresJS)
})