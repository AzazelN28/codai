<template>
  <div class="pen">
    <header>
      <div class="left">
        <NuxtLink to="/"><i class='bx bx-brain'></i></NuxtLink>
        <h1>{{ penStore.title }}</h1>
      </div>
    </header>
    <main>
      <Chat :id="id"></Chat>
      <Editors :id="id"></Editors>
      <Preview :id="id" :t="t"></Preview>
    </main>
    <footer>
      <h6>AI, taking your jobs, one by one, since 2023.</h6>
    </footer>
  </div>
</template>

<script setup>
import { usePenStore } from '~/stores/pen.js'
import { useChatStore } from '~/stores/chat.js'

const penStore = usePenStore()
const chatStore = useChatStore()

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: null
  }
})

const t = ref(Date.now())
const loading = ref(true)

useEventSource(`/api/v1/pens/${props.id}/sse`, (e) => {
  console.log(e)
  if (e.type === 'message') {
    t.value = Date.now()
    penStore.getPen(props.id)
  }
})

onMounted(async () => {
  await Promise.all([
    chatStore.getMessages(props.id),
    penStore.getPen(props.id)
  ])
  loading.value = false
})
</script>

<style scoped>
.pen {
  display: grid;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  grid-template-rows: 4rem 1fr 4rem;
}

header, footer {
  max-height: 4rem;
  background-color: #111;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header {
  border-bottom: 1px solid #333;
  padding: 1rem;
}

footer {
  border-top: 1px solid #333;
}

main {
  padding: 0 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  align-items: stretch;
}

header .left {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.bx {
  font-size: 2rem;
  color: #fff;
}
</style>
