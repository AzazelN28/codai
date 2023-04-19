<template>
  <Pen :id="route.params.id" />
</template>

<script setup>
const route = useRoute()
</script>
