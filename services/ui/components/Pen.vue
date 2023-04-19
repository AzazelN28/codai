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
      <Preview :id="id"></Preview>
    </main>
    <footer>
      <!-- NADA -->
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

const loading = ref(true)

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
  grid-template-rows: auto 1fr auto;
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
