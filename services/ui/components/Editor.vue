<template>
  <div class="editor">
    <div class="language">{{ language }}</div>
    <div ref="editor"></div>
  </div>
</template>

<script setup>
import { minimalSetup, EditorView } from 'codemirror'
import { EditorState, Compartment } from '@codemirror/state'
// import { language } from '@codemirror/language'
import { javascript } from '@codemirror/lang-javascript'
// import { html } from '@codemirrror/lang-html'
// import { css } from '@codemirror/lang-css'

const editor = ref(null)

const languageConf = new Compartment()

let view

onMounted(() => {
  console.log(editor.value)
  EditorView.theme({}, { dark: true })
  view = new EditorView({
    doc: '',
    extensions: [
      minimalSetup,
      languageConf.of(javascript())
    ],
    parent: editor.value,
  })
})

onUnmounted(() => view.destroy())

const props = defineProps({
  language: {
    type: String,
    required: true
  }
})
</script>

<style>
.editor {
  flex: 1 0 auto;
}

.editor .language {
  text-transform: uppercase;
}
</style>
