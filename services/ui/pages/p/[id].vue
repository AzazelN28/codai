<template>
  <Pen :id="route.params.id" />
</template>

<script setup>
import { usePenStore } from '~/stores/pen.js'

const penStore = usePenStore()
const title = computed(() => penStore.title)
const head = useHead({
  title: title,
})
const route = useRoute()
</script>
