<template>
  <div>
    <TheTopNav back
      @back="goBack" />

    <div class="page">
      <template v-if="outreach.relevantDescription">
        <h1>
          {{ outreach.relevantEmoji }} {{ outreach.relevantDescription }}
        </h1>
        <h2>{{ outreach.snippet }}</h2>
      </template>
      <h1 v-else>
        {{ outreach.snippet }}
      </h1>

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

      <TipTapTextarea v-model="replyText"
        min-height="8rem"
        class="mt-2 p-2 border border-gray-200 rounded-md" />

      <div class="w-full flex flex-row gap-4">
        <UButton @click="reply">
          Reply
        </UButton>

        <UButton variant="outline"
          @click="star">
          Star
        </UButton>

        <div class="flex-grow" />

        <UButton color="red"
          variant="outline"
          @click="markSpam">
          Mark as Spam
        </UButton>

        <UButton color="red"
          variant="outline"
          @click="ignore">
          Ignore
        </UButton>
      </div>
      <div class="italic text-gray-500 text-sm">
        This reply will be sent from your email to the sender.
        You can find a copy of it in your sent mail.
      </div>
    </div>
  </div>
</template>

<script setup>
import { useOutreachStore } from '@/stores/outreach'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: ['enforce-gmail-login'],
})

const outreachStore = useOutreachStore()
const { getOutreachByUuid } = storeToRefs(outreachStore)

const route = useRoute()

const [outreach] = await Promise.all([
  getOutreachByUuid.value(route.params.outreach),
])

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}

async function goBack() {
  await navigateTo('/app/dashboard')
}

const replyText = ref()

async function reply () {
  await outreachStore.replyToOutreach({ uuid: outreach.uuid, message: replyText })
  await navigateTo('/app/dashboard')
}

async function star () {
  await outreachStore.updateOutreach({ uuid: outreach.uuid, status: "starred"})
  await navigateTo('/app/dashboard')
}

async function ignore () {
  await outreachStore.updateOutreach({ uuid: outreach.uuid, status: "ignored"})
  await navigateTo('/app/dashboard')
}

async function markSpam () {
  await outreachStore.updateOutreach({ uuid: outreach.uuid, status: "spam"})
  await navigateTo('/app/dashboard')
}
</script>

<style lang="postcss" scoped>
.page {
  @apply mx-[8rem] px-16 py-8 border rounded-md border-gray-200
    min-h-[calc(100vh-100px)] flex flex-col gap-4;
}
</style>
