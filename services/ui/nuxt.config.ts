// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  head: {
    title: 'CodAI',
    meta: [
      { charset: 'utf8' },
      { description: 'CodAI, code faster, better and error proner' },
      { viewport: 'width=device-width, initial-scale=1' }
    ]
  },
  app: {
    rootId: 'codai'
  },
  modules: [
    '@pinia/nuxt'
  ],
  plugins: [
    '~/plugins/directives.client.js'
  ],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore'
    ],
  },
  css: [
    '~/assets/css/main.css',
    'boxicons/css/boxicons.min.css'
  ]
})
