<template>
  <div>
    <TheTopNav>
      <template #action-items>
      </template>
    </TheTopNav>

    <div class="max-w-[800px] mx-auto flex flex-col items-center gap-4">
      <div class="flex flex-row gap-2 items-center">
        <img v-if="outreach.companyLogoUrl"
          :src="outreach.companyLogoUrl"
          class="w-6 h-6 rounded-full" >
          <h2 v-if="outreach.companyName">{{ outreach.companyName }}</h2>
      </div>

      <h1>{{ outreach.snippet }}</h1>

      <div class="w-full flex flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-2">
          <span v-if="outreach.sender" class="text-gray-500">Made by {{ outreach.sender }}</span>
          <UButton v-if="outreach.calendarUrl"
            icon="i-heroicons-calendar"
            variant="ghost"
            :to="outreach.calendarUrl"
            class="text-blue-500" />
          <UButton v-if="outreach.linkedinUrl" 
            variant="ghost"
            :to="outreach.linkedinUrl"
            class="text-blue-500">
            <img src="/linkedin-logo.png" class="w-4 h-4">
          </UButton>
        </div>

        <div class="text-gray-500">
          {{ prettyFormatDate(outreach.createdAt) }}
        </div>
      </div>

      <TipTapTextarea v-model="outreach.body"
        :readonly
        class="w-full border-none p-0" />

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
  getOutreachByUuid.value(route.params.uuid),
])

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}

async function reply () {
  await outreachStore.replyToOutreach({ uuid: outreach.uuid })
  await navigateTo('https://mail.google.com/mail/u/#drafts', 
    { open: { target: "_blank" } })
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
</style>
