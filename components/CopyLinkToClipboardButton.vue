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
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia'

const props = defineProps({
  user: { type: Object, required: true },
  popoverText: { type: String, default: 'Copy Profile Link to Clipboard' },
  icon: { type: String, default: 'i-heroicons-link' },
})

const { frontendBaseUrl } = useAppConfig()
const fullPublicLink = computed(() => `${frontendBaseUrl}${props.user.publicLink}`)

async function copyToClipboard () {
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(fullPublicLink.value)
  } else {
    console.log(`can't find navigator, but would copy '${fullPublicLink.value}'`)
  }
}
</script>

<style lang="postcss" scoped>
</style>
