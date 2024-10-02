<template>
  <div>
    <TheTopNav>
      <template #action-items>
        <div>
          <UButton variant="outline"
            icon="i-heroicons-arrow-left"
            to="/app/dashboard">
            Back to Dashboard
          </UButton>
        </div>
      </template>
    </TheTopNav>

    <div class="mx-12 p-4 border rounded-md border-gray-200 min-h-[calc(100vh-100px)]">
      <div class="max-w-[800px] mx-auto flex flex-col items-center gap-4">
        <div class="flex flex-row gap-2 items-center">
          <img v-if="outreach.companyLogoUrl"
            :src="outreach.companyLogoUrl"
            class="w-6 h-6 rounded-full">
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
              target="_blank"
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
          <UButton @click="reply = true">
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
        
        <div v-show="reply" class="w-full">
          <TipTapTextarea v-model="replyText"
            min-height="8rem"
            class="mt-2 p-2 border border-gray-200 rounded-md" />

          <div class="mt-2 flex flex-row justify-between items-center">
            <div class="italic text-gray-500 text-sm">
              This reply will be sent from your email to the sender. <br>
              You can find a copy of it in your sent mail.
            </div>

            <UButton 
              @click="sendReply">
              Send Reply
            </UButton>
          </div>
        </div>
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

const reply = ref(false)
const replyText = ref()

async function sendReply () {
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
</style>
