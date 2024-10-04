<template>
  <UPopover mode="hover">
    <UButton variant="ghost"
      :icon
      @click="copyToClipboard" />

    <template #panel>
      <div class="p-2 text-xs">
        {{ popoverText }}
      </div>
    </template>
  </UPopover>
</template>

<script setup>
const props = defineProps({
  clipboardText: { type: String, required: true },
  popoverText: { type: String, default: 'Copy Profile Link to Clipboard' },
  icon: { type: String, default: 'i-heroicons-link' },
})

async function copyToClipboard () {
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(props.clipboardText)
  } else {
    console.log(`can't find navigator, but would copy '${props.clipboardText}'`)
  }
}
</script>

<style lang="postcss" scoped>
</style>
