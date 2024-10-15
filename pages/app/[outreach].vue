<template>
  <div>
    <TheTopNav back
      @back="goBack" />

    <div class="page">
      <div class="header">
        <h1 v-if="outreach.relevantDescription">
          {{ outreach.relevantEmoji }} 
          {{ outreach.snippet.length <= 100 
            ? outreach.snippet 
            : outreach.snippet.substring(0, 100) + "..." }}
        </h1>
        <div>
          <UIcon v-if="outreach.isSaved"
            name="i-heroicons-star" />
        </div>
      </div>

      <div class="flex flex-row items-center gap-2">
        <img v-if="outreach.companyLogoUrl"
          :src="outreach.companyLogoUrl"
          class="w-[.875rem] h-[.875rem]">
        <div class="text-sm text-gray-600">{{ outreach.companyName }}</div>
        <UButton v-if="outreach.calendarUrl"
          icon="i-heroicons-calendar"
          variant="ghost"
          :to="outreach.calendarUrl"
          class="text-blue-500" />
        <UButton v-if="outreach.linkedinUrl" 
          variant="ghost"
          :to="outreach.linkedinUrl"
          target="_blank"
          class="text-blue-500">
          <img src="/linkedin-logo.png" class="w-4 h-4">
        </UButton>
        <div class="flex-grow" />
        <div class="text-gray-500 text-sm">
          {{ prettyFormatDate(outreach.createdAt) }}
        </div>
      </div>

      <TipTapTextarea v-model="outreach.body"
        readonly
        class="w-full border-none p-0" />

      <div class="border-b borer-gray-600 w-full" />

      <TipTapTextarea v-if="me.hasSendScope" v-model="replyText"
        min-height="8rem"
        class="mt-2 p-2 border border-gray-200 rounded-md" />

      <div class="w-full flex flex-row gap-4">
        <SubmitButton :submission-state="replyState"
          icon="i-heroicons-arrow-up"
          readyText="Reply"
          submittingText="Replying"
          submittedText="Replied"
          @click="reply" />

        <UModal v-model="replyWarningIsOpen">
          <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
              Google OAuth Permission  Needed
            </template>

            <div class="text-sm">
              To quickly send an email response, we need an extra
              permission from your Google Account. To set this up, 
              click the Link below.
            </div>

            <div class="mt-4 text-sm">
              Be sure to check the box for "Send email on your behalf".
            </div>

            <GoogleOAuthButton force-consent
              class="mt-4" />

            <template #footer>
              <UButton @click="replyWarningIsOpen = false">Ok</UButton>
            </template>
          </UCard>
        </UModal>

        <SubmitButton :submission-state="saveState"
          icon="i-heroicons-star"
          variant="outline"
          readyText="Save"
          submittingText="Saving"
          submittedText="Saved"
          @click="save" />

        <div class="flex-grow" />

        <SubmitButton :submission-state="markSpamState"
          icon="i-heroicons-trash"
          variant="outline"
          color="red"
          readyText="Slam to Spam"
          submittingText="Slamming to Spam"
          submittedText="Slammed to Spam"
          @click="markSpam" />

        <SubmitButton :submission-state="ignoreState"
          icon="i-heroicons-arrow-down"
          variant="outline"
          color="red"
          readyText="Ignore"
          submittingText="Ignoring"
          submittedText="Ignored"
          @click="ignore" />
      </div>
      <div v-if="me.hasSendScope" class="italic text-gray-500 text-sm">
        This reply will be sent from your email to the sender.
        You can find a copy of it in your sent mail.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { useOutreachStore } from '@/stores/outreach'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: ['enforce-gmail-login'],
})

const outreachStore = useOutreachStore()
const { getOutreachByUuid } = storeToRefs(outreachStore)

const route = useRoute()

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [outreach, me] = await Promise.all([
  getOutreachByUuid.value(route.params.outreach),
  getMeCached.value(),
])

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}

async function goBack() {
  await navigateTo('/app/dashboard')
}

const replyText = ref()

const replyWarningIsOpen = ref(false)

const { submissionState: replyState, submitFn: reply } = useSubmit(async () => {
  if (me.hasSendScope) {
    await outreachStore.replyToOutreach({ uuid: outreach.uuid, message: replyText })
    await navigateTo('/app/dashboard')
  } else {
    replyWarningIsOpen.value = true
  }
})

const { submissionState: saveState, submitFn: save } = useSubmit(async () => {
  await outreachStore.updateOutreach({ uuid: outreach.uuid, isSaved: true, isNew: false })
})

const { submissionState: ignoreState, submitFn: ignore } = useSubmit(async () => {
  await outreachStore.updateOutreach({ uuid: outreach.uuid, isSaved: false, isNew: false })
  await navigateTo('/app/dashboard')
})

const { submissionState: markSpamState, submitFn: markSpam } = useSubmit(async () => {
  await outreachStore.updateOutreach({ uuid: outreach.uuid, isNew: false, isSaved: false, isSpam: true })
  await navigateTo('/app/dashboard')
})
</script>

<style lang="postcss" scoped>
.page {
  @apply mx-[8rem] px-16 py-8 border rounded-md border-gray-200
    min-h-[calc(100vh-100px)] flex flex-col gap-4;
}

.header { 
  @apply grid w-full;
  grid-template-columns: 1fr auto;
}
</style>
