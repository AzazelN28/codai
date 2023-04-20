<template>
  <div class="preview panel">
    <iframe :src="src" sandbox="allow-scripts"></iframe>
  </div>
</template>

<script setup>
const iframe = ref(null)

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: null
  },
  t: {
    type: Number,
    required: false,
    default: null
  }
})

const src = computed(() => `/api/v1/pens/${props.id}/iframe?t=${props.t}}`)
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
