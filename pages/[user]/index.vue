<template>
  <ThePublicTopNav :user
    :back="hasRelevancies && page === 'submit'"
    @back="page = 'relevance'" />

  <div v-if="page === 'relevance'"
    class="flex flex-col items-center max-w-[28rem] gap-8 mx-auto">
    <img :src="user.image"
      class="w-8 h-8 rounded-full">

    <h1 class="text-center">What's relevant to {{ user.firstName }}:</h1>

    <div class="flex flex-col gap-4 items-center w-full">
      <UButton v-for="r in user.relevancies"
        variant="outline"
        class="px-8 flex flex-row items-center w-full min-h-12 gap-2"
        @click="startOutreach(r)">
        <div class="text-gray-800">{{ r.emoji }}</div>
        <div class="text-gray-800">{{ r.description }}</div>
      </UButton>
    </div>

    <div class="border-b max-w-[19rem] border-gray-900 w-full" />

    <h2 class="-mb-4">Otherwise:</h2>

    <UButton variant="outline"
      class="px-8 flex flex-row items-center w-full min-h-12"
      @click="startOutreach(null)">
      <span class="text-gray-800 ml-[1.375rem]">Share how you're relevant to me</span>
    </UButton>
  </div>

  <div v-else-if="page === 'submit'"
    class="flex flex-col items-center max-w-[28rem] gap-8 mx-auto">
    <img :src="user.image"
      class="w-8 h-8 rounded-full">

    <h1 v-if="relevancy.description"
      class="text-center">{{ relevancy.emoji }} {{ relevancy.description }}</h1>
    <h1 v-else
      class="text-center">What are you reaching out about?</h1>

    <div class="w-full">
      <div class="px-4 flex flex-row items-center justify-between mb-2">
        <div class="text-sm">Your Email</div>
      </div>
      <UInput v-model="sender"
        class="w-full" />
    </div>

    <div class="w-full">
      <div class="px-4 flex flex-row items-center justify-between mb-2">
        <div class="text-sm">Why is your solution relevant to me?</div>
        <div class="text-gray-400 text-sm">{{ snippet.length }}/50 characters</div>
      </div>
      <UInput v-model="snippet"
        class="w-full" />
      <div v-if="snippet.length > 50" 
        class="mt-2 ml-2 text-xs text-red-500 italic">
        We may truncate this to 50 characters when showing {{ user.firstName }}
      </div>
    </div>

    <div class="w-full">
      <div class="px-4 flex flex-row items-center justify-between mb-2">
        <div class="text-sm">Share how you add value with an example:</div>
        <div class="text-gray-400 text-sm">{{ characterCount }}/500 characters</div>
      </div>
      <TipTapTextarea v-model="body"
        class="w-full block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-textarea rounded-md placeholder-gray-400 dark:placeholder-gray-500 text-sm px-2.5 py-1.5 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 resize-none"
        character-count
        @update:character-count="updateCharacterCount" />
    </div>

    <div class="w-full">
      <div class="links">
        <UIcon name="i-heroicons-check-circle"
          :class="linkedinUrl ? 'text-green-500' : 'text-gray-300'"
          class="w-5 h-5" />
        <div class="text-gray-600">LinkedIn Profile</div>
        <UInput v-model="linkedinUrl" class="max-w-[400px]"/>

        <UIcon name="i-heroicons-check-circle"
          :class="calendarUrl ? 'text-green-500' : 'text-gray-300'"
          class="w-5 h-5" />
        <div class="text-gray-600">Calendar Link</div>
        <UInput v-model="calendarUrl" class="max-w-[400px]" />

        <UIcon name="i-heroicons-check-circle"
          :class="companyName ? 'text-green-500' : 'text-gray-300'"
          class="w-5 h-5" />
        <div class="text-gray-600">Company Name</div>
        <UInput v-model="companyName" class="max-w-[400px]" />

        <UIcon name="i-heroicons-check-circle"
          :class="companyLogoUrl ? 'text-green-500' : 'text-gray-300'"
          class="w-5 h-5" />
        <div class="text-gray-600">Company Logo Url</div>
        <div class="flex flex-row items-center gap-2">
          <UInput v-model="companyLogoUrl" class="w-full max-w-[400px]" />
          <img v-if="companyLogoUrl" :src="companyLogoUrl" 
            class="w-5 h-5" />
        </div>
      </div>

      <div class="mt-4 text-gray-400 text-sm">
        * Including these greatly increases the likelihood of a response
      </div>
    </div>

    <div>
      <UButton @click="submit" :disabled="!allowSubmit">Submit</UButton>
    </div>
  </div>

  <div class="h-20"></div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'
import { useOutreachStore } from '@/stores/outreach'

const outreachStore = useOutreachStore()

const usersStore = useUsersStore()
const { getUserByShortcode } = storeToRefs(usersStore)

const route = useRoute()
const [user] = await Promise.all([
  getUserByShortcode.value(route.params.user)
])

const hasRelevancies = user.relevancies && !!user.relevancies.length

const page = ref(hasRelevancies ? "relevance" : "submit")
const relevancy = ref({})

async function startOutreach(r) {
  relevancy.value = r ?? {}
  page.value = 'submit'
}

if (!user.email) {
  await navigateTo('https://www.relevance.to', { external: true })
}

const metaTitle = `Click to chat with ${user.firstName}`

useSeoMeta({
  title: metaTitle,
  ogTitle: metaTitle,
  twitterCard: 'summary',
  twitterTitle: metaTitle,
  ogImage: '/logo.svg',
  twiggerImage: '/logo.svg',
})

const characterCount = ref(0)

async function updateCharacterCount ({ characters }) {
  characterCount.value = characters
}

const sender = ref()
const snippet = ref('')
const body = ref('')
const linkedinUrl = ref()
const calendarUrl = ref()
const companyName = ref()
const companyLogoUrl = ref()

const submit = async () => {
  const uuid = await outreachStore.createOutreachByPublic({ 
    sender,
    snippet,
    body,
    linkedinUrl,
    calendarUrl,
    companyName,
    companyLogoUrl,
    relevantEmoji: relevancy.value.emoji,
    relevantDescription: relevancy.value.description,
    recipient: user.email,
  })

  await navigateTo(`/${route.params.user}/${uuid}`)
}

const allowSubmit = computed(() => 
  sender.value && snippet.value && body.value)
</script>

<style lang="postcss" scoped>
.links {
  @apply w-full grid items-center gap-x-4 gap-y-4;
  grid-template-columns: auto auto 1fr;
}
</style>
