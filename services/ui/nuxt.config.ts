// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    rootId: 'codai'
  },
  modules: [
    '@pinia/nuxt'
  ],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore'
    ],
  },
  css: [
    '~/assets/css/main.css'
  ]
})
