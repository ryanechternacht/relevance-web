<template>
  <ThePublicTopNav :user 
    :back="page === 'submit'"
    @back="page = 'relevancy'" />

  <div v-if="page === 'relevancy'"
    class="flex flex-col items-center max-w-[28rem] gap-8 text-center mx-auto">
    <img :src="user.image"
      class="w-8 h-8 rounded-full">

    <h1>What's Relevant {{ user.firstName }}:</h1>

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
    class="px-12 flex flex-col gap-6">
    <div>
      <div class="w-full flex flex-row justify-between">
        <div class="text-gray-600">
          Why is your solution relevant to me?
        </div>

        <div class="text-gray-400">
          &lt;50 characters
        </div>
      </div>

      <MultilineInput v-model="snippet"
        class="mt-2 !text-2xl font-extrabold" />
    </div>

    <div>
      <div class="text-gray-600">
        What are you selling?
      </div>

      <USelect v-model="companyType" 
        :options
        placeholder="Company Type"
        class="mt-2 max-w-[400px]" /> 
    </div>

    <div>
      <div class="w-full flex flex-row justify-between">
        <div class="text-gray-600">
          Share how you add value with a relevant example:
        </div>

        <div class="text-gray-400">
          &lt;1,000 characters
        </div>
      </div>

      <TipTapTextarea v-model="body"
        class="mt-2 p-2 border border-gray-200 rounded-md" />
    </div>

    <div>
      <h2>Your info</h2>
      <div class="links">
        <UIcon name="i-heroicons-check-circle"
          :class="sender ? 'text-green-500' : 'text-gray-300'"
          class="w-5 h-5" />
        <div class="text-gray-600">Email</div>
        <UInput v-model="sender" class="max-w-[400px]" />

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
  getUserByShortcode.value(route.params.userid)
])

const page = ref(user.relevancies && user.relevancies.length
  ? "relevancy"
  : "submit"
)
const relevance = ref()

async function startOutreach(r) {
  if (r) {
    relevance.value = r
  }
  page.value = 'submit'
}

const options = [
  {
    label: 'Services (Agency)',
    value: 'services',
  }, {
    label: 'Software Product',
    value: 'software',
  },
]

const sender = ref()
const companyType = ref(null)
const snippet = ref()
const body = ref()
const linkedinUrl = ref()
const calendarUrl = ref()
const companyName = ref()
const companyLogoUrl = ref()

const submit = async () => {
  await outreachStore.createOutreach({ 
    sender,
    companyType,
    snippet,
    body,
    linkedinUrl,
    calendarUrl,
    companyName,
    companyLogoUrl,
    recipient: user.email,
  })

  await navigateTo(`${route.params.userid}/success`)
}

const allowSubmit = computed(() => 
  snippet.value && companyType.value && body.value
    && (sender.value || linkedinUrl.value || calendarUrl.value)
)
</script>

<style lang="postcss" scoped>
.links {
  @apply grid items-center gap-x-4 gap-y-4;
  grid-template-columns: auto auto 1fr;
}
</style>
