<template>
  <div class="preview panel">
    <iframe ref="iframe" :src="src" sandbox="allow-scripts"></iframe>
  </div>
</template>

<script setup>
const iframe = ref(null)

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: null
  }
})

const src = computed(() => `/api/v1/pens/${props.id}/iframe`)

onMounted(() => {
  const sse = new EventSource(`/api/v1/pens/${props.id}/sse`)
  sse.onerror = (e) => console.error(e)
  sse.onmessage = (e) => {
    console.log(e, iframe.value)
    iframe.value.src = iframe.value.src
  }
  sse.onopen = (e) => console.log(e)
  console.log('sse', sse)
})
</script>

<style scoped>
.preview {
  grid-column: 3;
  grid-row: 1 / span 3;
  background-color: #fff;
}

.preview iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
