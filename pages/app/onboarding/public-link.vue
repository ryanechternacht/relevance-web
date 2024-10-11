<template>
  <TheTopNav is-onboarding />
  <div class="mt-20 w-full flex flex-col items-center gap-8">
    <ProgressSteps :current-step="0"
      @step-selected="navToStep" />

    <div>Select your page name:</div>

    <div class="flex flex-row items-center">
      <div class="text-2xl">relevance.to/</div>
      <UFormGroup :error="!!error">
        <UInput v-model="publicLink"
          size="xl"
          class="ml-[2px] w-[20rem]" />
      </UFormGroup>
    </div>

    <div v-if="error" class="-mt-6 text-sm text-red-500 italic">
      {{ error }}
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

const publicLink = ref(me.publicLink)

const error = ref(false)
async function next () {
  const result = await usersStore.updatePublicLink({ publicLink })
  if (result.error) {
    error.value = result.error
  } else {
    error.value = null
    await usersStore.updateUser({ onboardingStep: 'relevancies' })
    await navigateTo('/app/onboarding/relevancies')
  }
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

<style lang="postcss">
</style>
