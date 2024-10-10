<template>
  <ThePublicTopNav :user 
    back
    @back="back" />

  <div class="flex flex-col items-center max-w-[28rem] gap-8 mx-auto">
    <img :src="user.image"
      class="w-8 h-8 rounded-full">

      <h1>Submitted to {{ user.firstName }}</h1>

      <div class="w-full flex flex-row items-center gap-2">
        <div>from: {{ outreach.sender }}</div>

        <div class="flex-grow" />

        <UButton v-if="outreach.linkedinUrl" 
          variant="ghost"
          :to="outreach.linkedinUrl"
          target="_blank"
          class="text-blue-500">
          <img src="/linkedin-logo.png" class="w-4 h-4">
        </UButton>
        <UButton v-if="outreach.calendarUrl"
          icon="i-heroicons-calendar"
          variant="ghost"
          :to="outreach.calendarUrl"
          class="text-blue-500" />
      </div>

      <h2 class="w-full">{{ outreach.snippet }}</h2>

      <TipTapTextarea v-model="outreach.body"
        class="w-full"
        readonly />
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { useOutreachStore } from '@/stores/outreach'
import { storeToRefs } from 'pinia'

const usersStore = useUsersStore()
const { getUserByShortcode } = storeToRefs(usersStore)

const outreachStore = useOutreachStore()
const { getOutreachForPublic } = storeToRefs(outreachStore)

const route = useRoute()
const [user, outreach] = await Promise.all([
  getUserByShortcode.value(route.params.user),
  getOutreachForPublic.value(route.params.outreach),
])

async function back() {
  await navigateTo(`/${user.publicLink}`)
}
</script>

<style lang="postcss" scoped>
.header-bar {
  @apply w-full px-12 py-8 grid items-center;
  grid-template-columns: 1fr 1fr 1fr;
}

</style>
