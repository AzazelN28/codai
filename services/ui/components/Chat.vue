<template>
  <div class="chat">
    <div class="messages">
      <div class="message" v-for="message in chatStore.messages" :key="message.id">
        {{ message }}
      </div>
    </div>
    <form class="send" @submit.prevent="onSubmit">
      <input type="text" v-model="message" />
    </form>
  </div>
</template>

<script setup>
import { useChatStore } from '~/stores/chat.js'

const ChatRole = {
  USER: 'user',
  ASSISTANT: 'assistant'
}

const chatStore = useChatStore()

const message = ref('')

async function onSubmit() {
  chatStore.addMessage(ChatRole.USER, message.value)
  const body = {
    messages: [{
      role: ChatRole.USER,
      content: message.value
    }]
  }
  message.value = ''
  const response = await fetch('/api/v1/chat', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  chatStore.addMessage(
    data.choices[0].message.role,
    data.choices[0].message.content,
    data.id
  )
}
</script>

<style>
.chat {
  grid-area: chat;
}

.messages {
  flex: 1 0 auto;
  overflow-y: auto;
}

.message {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
}
</style>
