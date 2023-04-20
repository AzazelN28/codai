<template>
  <div class="chat panel">
    <div class="container">
      <div class="messages" v-scroll-bottom>
        <div class="message" :class="message.role" v-for="message in chatStore.messages" :key="message.id">
          <div class="content" v-html="markdown(message.message)"></div>
        </div>
      </div>
    </div>
    <form class="send" @submit.prevent="onSubmit">
      <input v-if="recording !== 'started'" ref="text" type="text" :disabled="sending" v-model="message" />
      <canvas ref="audio" v-else></canvas>
      <button type="button" :disabled="sending" @click="onMic">
        <i v-if="recording !== 'started'" class="bx bx-microphone"></i>
        <i v-else class="bx bxs-microphone"></i>
      </button>
      <button type="submit" :disabled="sending">
        <i v-if="!sending" class='bx bxs-send'></i>
        <i v-else class='bx bxs-brain'></i>
      </button>
    </form>
  </div>
</template>

<script setup>
import hljs from 'highlight.js'
import { marked } from 'marked'
import { useChatStore } from '~/stores/chat.js'

function highlight (code, lang) {
  const language = hljs.getLanguage(lang) ? lang : 'plaintext'
  return hljs.highlight(code, { language }).value
}

function markdown(code) {
  return marked(code, { highlight })
}

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: null
  }
})

const ChatRole = {
  SYSTEM: 'system',
  USER: 'user',
  ASSISTANT: 'assistant'
}

const chatStore = useChatStore()

const sending = ref(false)
const recording = ref('stopped')
const message = ref('')
const audio = ref(null)
const text = ref(null)

let mediaRecorder, top, left, width, height

async function onMic() {
  if (recording.value === 'starting' || recording.value === 'stopping')
    return

  if (recording.value === 'stopped') {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    })
    const audioContext = new AudioContext()
    audioContext.addEventListener('statechange', () => {
      console.log('AudioContext state:', audioContext.state)
    })
    const mediaStreamSource = new MediaStreamAudioSourceNode(audioContext, {
      mediaStream: audioStream
    })
    const analyser = new AnalyserNode(audioContext, {
      fftSize: 2048
    })
    mediaStreamSource.connect(analyser)
    const data = new Float32Array(analyser.frequencyBinCount)

    let frameId, canvas, canvasContext
    function onFrame() {
      if (!canvas && audio.value) {
        canvas = audio.value
      }

      if (!canvasContext && canvas) {
        canvasContext = canvas.getContext('2d')
      }

      if (!canvas || !canvasContext) {
        frameId = requestAnimationFrame(onFrame)
        return
      }

      // const expectedWidth = canvas.clientWidth
      if (canvas.width !== width) {
        canvas.width = width
      }

      // const expectedHeight = canvas.clientHeight
      if (canvas.height !== height) {
        canvas.height = height
      }

      analyser.getFloatTimeDomainData(data)

      const ctx = canvasContext
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.beginPath()
      for (let i = 0; i < data.length; i++) {
        const value = data[i]
        const x = i / data.length * canvas.width
        const y = (value + 1) / 2 * canvas.height
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.strokeStyle = '#000'
      ctx.stroke()

      frameId = requestAnimationFrame(onFrame)
    }

    frameId = requestAnimationFrame(onFrame)

    mediaRecorder = new MediaRecorder(audioStream)
    const chunks = []
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data)
    }
    mediaRecorder.onerror = (e) => console.error(e)
    mediaRecorder.onpause = (e) => console.log(e)
    mediaRecorder.onresume = (e) => console.log(e)
    mediaRecorder.onstart = (e) => {
      console.log(e)
      recording.value = 'started'
    }
    mediaRecorder.onstop = async (e) => {
      cancelAnimationFrame(frameId)
      console.log(e)
      sending.value = true
      // TODO: Obtener la extensión a partir del mime type.
      const file = new File(chunks, 'audio.webm', { type: mediaRecorder.mimeType })
      const formData = new FormData()
      formData.append('file', file)
      const response = await fetch('/api/v1/chats/' + props.id + '/audio', {
        method: 'post',
        header: {
          'Content-Type': 'multipart/form-data'
        },
        body: formData
      })
      console.log(response)
      const [text, data] = await response.json()
      chatStore.addMessage(ChatRole.USER, text)
      chatStore.addMessage(
        data.choices[0].message.role,
        data.choices[0].message.content,
        data.id
      )
      recording.value = 'stopped'
      sending.value = false
    }
    mediaRecorder.start()

    ({ top, left, width, height } = text.value.getBoundingClientRect());

    recording.value = 'starting'
  } else {
    mediaRecorder.stop()
    recording.value = 'stopping'
  }
}

async function onSubmit() {
  sending.value = true
  chatStore.addMessage(ChatRole.USER, message.value)
  const body = {
    message: message.value
  }
  message.value = ''
  const response = await fetch('/api/v1/chats/' + props.id, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  })
  const [, data] = await response.json()
  chatStore.addMessage(
    data.choices[0].message.role,
    data.choices[0].message.content,
    data.id
  )
  sending.value = false
}
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  grid-column: 1;
  grid-row: 1 / span 3;
}

.container {
  flex: 1 0 auto;
  position: relative;
}
.messages {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  padding: 2rem;
}

.message {
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  box-shadow: 0 0 0.5rem hsla(0, 0%, 0%, 0.5);
  margin-bottom: 1rem;
}

.message.user {
  background: hsl(60, 30%, 30%);
}

.message.assistant {
  background: hsl(220, 30%, 30%);
}

.send {
  display: flex;
}

canvas {
  background-color: #fff;
}

input[type="text"] {
  flex: 1 0 auto;
  padding: 1rem;
  border: 0;
}

button {
  color: hsl(0, 0%, 100%);
  background-image: linear-gradient(45deg, hsl(80, 100%, 70%), hsl(220, 50%, 50%));
  padding: 1rem;
  border: 0;
  transition: all .5s ease-out;
}

button:hover {
  background-image: linear-gradient(45deg, hsl(80, 100%, 80%), hsl(220, 50%, 60%));
}

button:disabled {
  background-image: linear-gradient(45deg, hsl(80, 0%, 70%), hsl(220, 0%, 50%));
}
</style>
