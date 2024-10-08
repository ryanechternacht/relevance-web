<template>
  <TheTopNav is-onboarding />

  <div class="mt-20 w-full flex flex-col items-center gap-8">
    <ProgressSteps current-step="2" />

    <div>Don't forget to:</div>
    
    <div class="grid-layout">
      <UIcon name="i-heroicons-link" />
      <div class="cursor-pointer hover:underline"
        @click="copyToClipboard">Click here to share a link to your page</div>

      <img src="/linkedin-logo.png"
        class="w-4 h-4" />
      <div>Add a link to your LinkedIn Bio</div>
    </div>

    <UButton @click="next">
      Next
    </UButton>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia'

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value(),
])

const { frontendBaseUrl } = useAppConfig()
const publicLink = computed(() => `${frontendBaseUrl}${me.publicLink}`)

async function copyToClipboard () {
  if (navigator?.clipboard) {
    await navigator.clipboard.writeText(publicLink.value)
  } else {
    console.log(`can't find navigator, but would copy '${publicLink.value}'`)
  }
}

async function next () {
  await usersStore.updateUser({ onboardingStep: 'done' })
  await navigateTo('/app/dashboard')
}
</script>

<style lang="postcss" scoped>
.grid-layout {
  @apply grid gap-4 w-[25rem] items-center;
  grid-template-columns: auto 1fr; 
}
</style>
