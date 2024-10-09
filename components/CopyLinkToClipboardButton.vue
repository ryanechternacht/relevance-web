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
  user: { type: String },
  popoverText: { type: String, default: 'Copy Profile Link to Clipboard' },
  icon: { type: String, default: 'i-heroicons-link' },
})

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value(),
])

const { frontendBaseUrl } = useAppConfig()
const fullPublicLink = computed(() => 
  props.user
    ? `${frontendBaseUrl}${props.user.publicLink}`
    : `${frontendBaseUrl}${me.publicLink}`)

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
