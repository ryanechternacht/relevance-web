<template>
  <TheTopNav is-onboarding />

  <div class="mt-20 w-full flex flex-col items-center gap-8">
    <ProgressSteps :current-step="2"
      @step-selected="navToStep" />

    <div>Don't forget to:</div>
    
    <div class="grid-layout">
      <UIcon name="i-heroicons-link" />
      <div class="cursor-pointer hover:underline"
        @click="copyToClipboard">Click this to share a link to your page</div>

      <UIcon name="i-heroicons-envelope" />
      <div class="cursor-pointer hover:underline"
        @click="copyMessageToClipboard">Click this to copy a message + link to your page</div>

      <img src="/linkedin-logo.png"
        class="w-4 h-4" />
      <NuxtLink class="cursor-pointer hover:underline"
        to="https://www.linkedin.com/help/linkedin/answer/a550614/set-and-edit-away-message-on-linkedin?lang=en"
        target="_blank">
        Add to your LinkedIn Bio + set as a default for dms
      </NuxtLink>
    </div>

    <UButton @click="next">
      Complete Onboarding
    </UButton>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia'
import Mustache from 'mustache'

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value(),
])

const { frontendBaseUrl } = useAppConfig()
const profileLink = computed(() => `${frontendBaseUrl}${me.publicLink}`)

async function copyToClipboard () {
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(profileLink.value)
  } else {
    console.log(`can't find navigator, but would copy '${profileLink.value}'`)
  }
}

const message = computed(() => 
  Mustache.render(me.publicLinkMessage, { profileLink: profileLink.value }))

async function copyMessageToClipboard () {
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(message.value)
  } else {
    console.log(`can't find navigator, but would copy '${message.value}'`)
  }
}

async function next () {
  await usersStore.updateUser({ onboardingStep: 'done' })
  await navigateTo('/app/dashboard')
}

async function navToStep({ step }) {
  const url = {
    0: '/app/onboarding/public-link',
    1: '/app/onboarding/relevancies',
    2: '/app/onboarding/linkedin',
  }[step]

  return await navigateTo(url)
}
</script>

<style lang="postcss" scoped>
.grid-layout {
  @apply grid gap-4 w-[25rem] items-center;
  grid-template-columns: auto 1fr; 
}
</style>
