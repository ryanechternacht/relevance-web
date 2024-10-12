<template>
  <!-- For some reason, setting height on this element and height: 100% on the
       inner .ProseMirror element makes the prose mirror set it's height correctly,
       but setting a min-height on here (and the height 100% on .ProseMirror) doesn't
       set the .ProseMirror height correctly. So we are going to flow a value down
       to the .ProseMirror -->
  <editor-content 
    :editor="editor"
    class="editor body h-full"
    :class="[isDemo ? 'bg-gray-100' : 'bg-white']" />
</template>

<script setup>
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu, useEditor, EditorContent, FloatingMenu } from '@tiptap/vue-3'
import CharacterCount from '@tiptap/extension-character-count'

const props = defineProps({ 
  modelValue: { type: String },
  placeholder: { type: String, default: '' },
  minHeight: { type: String, default: "40px" },
  readonly: { type: Boolean, default: false },
  isDemo: { type: Boolean, default: false },
  characterCount: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'update:characterCount'])

const editor = useEditor({
  editable: !(props.readonly || props.isDemo),
  content: props.isDemo ? '<i>To be filled in by the buyer</i>' : props.modelValue,
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    props.characterCount ? CharacterCount.configure({
      limit: 500,
    }) : null,
  ],
  onBlur() {
    emit('update:modelValue', editor.value.getHTML())
  }
})

async function onMounted() {
  setInterval(() => emit('update:characterCount', { characters: editor.value.storage.characterCount.characters() }), 100)
}

watch(() => props.modelValue, (newModelValue) => {
  editor.value.commands.setContent(newModelValue, false)
})

function focus () {
  editor.value.commands.focus()
}

defineExpose({ focus })
</script>

<style lang="postcss" scoped>
.editor :deep() {
  *:focus-visible {
    outline: 0
  }

  ul {
    list-style: circle !important;
    list-style-position: inside !important;
  }

  ol {
    list-style: decimal !important;
    list-style-position: inside !important;
  }

  li p {
    display: inline;
  }

  blockquote {
    @apply pl-[.4rem] border-l-[2px] border-l-gray-300;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    color: #adb5bd;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  p, div, span, .body, b {
    @apply text-gray-700;
  }

  .ProseMirror {
    @apply h-full;
    min-height: v-bind(minHeight);
  }
}
</style>
