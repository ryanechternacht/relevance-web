<template>
  <div class="p-20">
    <div class="flex flex-col gap-2">
      <div>Monitoring Status: <strong>{{ mailSyncStatusMap[me.mailSyncStatus].text }}</strong></div>
      <div class="text-sm text-gray-400">{{ mailSyncStatusMap[me.mailSyncStatus].helperText }}</div>
    </div>

    <!-- TODO pull from config -->
    <UButton to="http://api.buyersphere-local.com/v0.1/gmail-approval">Sync Google Account</UButton>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: ['enforce-gmail-login'],
})

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
