<template>
  <Editor language="html" :id="id" :source="penStore.html"></Editor>
  <Editor language="css" :id="id" :source="penStore.css"></Editor>
  <Editor language="js" :id="id" :source="penStore.js"></Editor>
</template>

<script setup>
import { usePenStore } from '~/stores/pen.js'

const penStore = usePenStore()

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: null
  }
})
</script>
