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
import Mustache from 'mustache'

const props = defineProps({
  user: { type: Object },
  popoverText: { type: String, default: 'Copy Relevance Message to Clipboard' },
  icon: { type: String, default: 'i-heroicons-envelope' },
})

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value(),
])

const user = props.user ?? me

const { frontendBaseUrl } = useAppConfig()
const profileLink = computed(() => `${frontendBaseUrl}${user.publicLink}`)

const message = Mustache.render(user.publicLinkMessage, { profileLink })

async function copyToClipboard () {
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(message)
  } else {
    console.log(`can't find navigator, but would copy: \n\n${message}`)
  }
}
</script>

<style lang="postcss" scoped>
</style>
