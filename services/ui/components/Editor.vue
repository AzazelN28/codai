<template>
  <div class="editor" :class="language">
    <div class="language">
      <i v-if="language === 'html'" class='bx bxl-html5'></i>
      <i v-if="language === 'css'" class='bx bxl-css3'></i>
      <i v-if="language === 'js'" class='bx bxl-javascript'></i>
      {{ language }}
    </div>
    <div class="code" ref="editor"></div>
  </div>
</template>

<script setup>
import { basicSetup, EditorView } from 'codemirror'
import { EditorState, Compartment } from '@codemirror/state'
// import { language } from '@codemirror/language'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'

const editor = ref(null)

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  }
})

function getLanguageConf(language) {
  const languageConf = new Compartment()
  switch (language) {
    case 'html': return languageConf.of(html())
    case 'css': return languageConf.of(css())
    case 'js': return languageConf.of(javascript())
  }
}

let view

onUpdated(() => {
  view.dispatch({
    changes: {
      from: 0,
      to: view.state.doc.length,
      insert: props.source
    }
  })
})

onMounted(() => {
  console.log(editor.value)
  EditorView.theme({}, { dark: true })
  view = new EditorView({
    doc: props.source,
    extensions: [
      basicSetup,
      getLanguageConf(props.language),
      EditorView.updateListener.of(async (view) => {
        if (view.docChanged) {
          // Document changed
          console.log(view.docChanged)
          const response = await fetch(`/api/v1/pens/${props.id}`, {
            method: 'put',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              [props.language]: view.state.doc.toString()
            })
          })
          console.log(await response.text())
        }
      })
    ],
    parent: editor.value,
  })
})

onUnmounted(() => view.destroy())
</script>

<style>
.bxl-html5 {
  color: hsl(20 70% 50%)
}

.bxl-css3 {
  color: hsl(200 70% 50%)
}

.bxl-javascript {
  color: hsl(60 70% 50%)
}

.editor {
  grid-column: 2;
}

.editor.html {
  grid-row: 1;
}

.editor.css {
  grid-row: 2;
}

.editor.js {
  grid-row: 3;
}

.code {
  position: relative;
  max-width: 33vw;
  overflow: auto;
}

.language {
  padding: 0.5rem 0.25rem;
  background-color: #222;
}

.cm-scroller {
  overflow: auto;
  max-width: 32vw;
  max-height: 26vh;
}
</style>
