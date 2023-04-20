export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('v-scroll-bottom', function(el, binding) {
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  })
})
