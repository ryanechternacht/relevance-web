<template>
  <EasyPopover :text="popoverText">
    <UButton variant="ghost"
      :icon
      @click="copyToClipboard" />
  </EasyPopover>
</template>

<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia'

const props = defineProps({
  user: { type: Object, required: true },
  popoverText: { type: String, default: 'Copy link to profile' },
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
