<template>
  <div class="p-20">
    <div class="flex flex-col gap-2">
      <div>Monitoring Status: <strong>{{ mailSyncStatusMap[me.mailSyncStatus].text }}</strong></div>
      <div class="text-sm text-gray-400">{{ mailSyncStatusMap[me.mailSyncStatus].helperText }}</div>
    </div>

    <UButton :to="gmailSyncUrl">Sync Google Account</UButton>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: ['enforce-gmail-login'],
})

const { apiBaseUrl } = useAppConfig()

const gmailSyncUrl = computed(() => `${apiBaseUrl}v0.1/gmail-approval`)

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value()
])

const mailSyncStatusMap = {
  'setup-required': {
    text: 'Needs Configuration',
    helperText: 'Please click the button below to setup Relevance'
  },
  ready: {
    text: 'Ready and Working',
  },
  error: {
    // TODO
  }
}
</script>

<style lang="postcss" scoped>
</style>
