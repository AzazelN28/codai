<template>
  <main>
    <div class="logo">
      <i class="bx bx-brain"></i>
      <h1>CodAI</h1>
    </div>
    <div class="cta">
      <button type="submit" @click="onClick">
        New pen
      </button>
    </div>
  </main>
</template>

<script setup>
import Status from 'http-status-codes'

const router = useRouter()

async function onClick(e) {
  const response = await fetch('/api/v1/pens', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (response.status === Status.CREATED)
  {
    const pen = await response.json()
    router.push({ path: `/p/${pen.id}` })
  }
  else {
    // TODO: Ya veré lo que hago.
  }
}
</script>

<style scoped>
.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  font-size: 4rem;
}

.logo .bx {
  font-size: 10rem;
}

main {
  display: grid;
  place-items: center;
}

button {
  padding: 2rem;
  font-size: 2rem;
  border-radius: .5rem;
  border: 0;
  color: #fff;
  background-image: linear-gradient(45deg, hsl(80, 100%, 70%), hsl(220, 50%, 50%));
  background-size: 100%;
    background-position: center;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.25);
  transition: all .5s ease-out
}

button:hover {
  padding: 2.5rem;
  font-size: 2.5rem;

  background-size: 150%;
}
</style>
