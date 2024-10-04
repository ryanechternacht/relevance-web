<template>
  <textarea
    v-model="value"
    :class="[overrideStyle ? '' : nuxtUiClasses ]"
    rows="1"
    ref="textarea"
    :placeholder
    :readonly
    @blur="emit('update:modelValue', value)"
    @input="removeNewLines" />
</template>

<script setup>
import lodash_pkg from 'lodash';
const { clone } = lodash_pkg;

const props = defineProps({
  modelValue: { type: String },
  readonly: { type: Boolean, default: false },
  placeholder: { type: String },
  overrideStyle: { type: Boolean },
})

// The css classes here are just stolen from UTextarea
const nuxtUiClasses = "block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-textarea rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm px-2.5 py-1.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 resize-none"

const emit = defineEmits(['update:modelValue'])

const textarea = ref(null)

const value = ref(clone(props.modelValue))

// modified from from https://github.com/nuxt/ui/blob/dev/src/runtime/components/forms/Textarea.vue
// i couldn't use the element directly because adjusting the model value to
// remove new lines wasn't being propogated back into the component for some reason
const autoResize = () => {
  if (!textarea.value) {
    return
  }

  textarea.value.rows = 1
  
  const styles = window.getComputedStyle(textarea.value)
  const paddingTop = parseInt(styles.paddingTop)
  const paddingBottom = parseInt(styles.paddingBottom)
  const padding = paddingTop + paddingBottom
  const lineHeight = parseInt(styles.lineHeight)
  const { scrollHeight } = textarea.value
  const newRows = (scrollHeight - padding) / lineHeight

  textarea.value.rows = newRows
}
onMounted(autoResize)

watch(() => props.modelValue, (newModelValue) => {
  value.value = newModelValue
})

function removeNewLines() {
  value.value = value.value.replace(/[\n\r]/g, '')
  nextTick(autoResize)
}
</script>

<style lang="postcss" scoped>
</style>
