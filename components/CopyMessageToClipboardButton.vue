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
import Mustache from 'mustache'

const props = defineProps({
  user: { type: Object },
  popoverText: { type: String, default: 'Copy message + link to profile' },
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

const message = computed(() => 
  Mustache.render(user.publicLinkMessage, { profileLink: profileLink.value }))

async function copyToClipboard () {
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(message.value)
  } else {
    console.log(`can't find navigator, but would copy: \n\n${message.value}`)
  }
}
</script>

<style lang="postcss" scoped>
</style>
