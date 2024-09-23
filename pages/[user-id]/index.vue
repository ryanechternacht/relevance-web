<template>
  <div class="header-bar">
    <div>
      <div class="text-gray-500 text-sm">Made with <span class="font-bold">Relevance</span></div>
    </div>

    <div class="w-full flex flex-row items-center justify-center gap-4">
      <img :src="user.image" class="h-[1.5rem] w-[1.5rem] rounded-full">
      <h1>Talk to {{ user.firstName }}</h1>
    </div>

    <div><!-- intentionally blank --></div>
  </div>
  <div class="px-12 flex flex-col gap-6">
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
        class="mt-2 w-full text-2xl font-extrabold border-b-2 border-b-gray-200" />
    </div>

    <div>
      <div class="text-gray-600">
        What are you selling?
      </div>

      <USelect v-model="companyType" class="mt-2 max-w-[400px]" :options />
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
import { useOutreachStore } from '@/stores/outreach'
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

const outreachStore = useOutreachStore()

const usersStore = useUsersStore()
const { getUserByShortcode } = storeToRefs(usersStore)

const route = useRoute()
const [user] = await Promise.all([
  getUserByShortcode.value(route.params.userid)
])

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
const companyType = ref()
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
.header-bar {
  @apply w-full px-12 py-8 grid items-center;
  grid-template-columns: 1fr 1fr 1fr;
}

.links {
  @apply grid items-center gap-x-4 gap-y-4;
  grid-template-columns: auto auto 1fr;
}
</style>
