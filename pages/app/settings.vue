<template>
  <div>
    <TheTopNav header="Settings">
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
      <div class="flex flex-col gap-2">
        <h2>Email Monitoring</h2> 
        <div>Status: <strong>{{ mailSyncStatusMap[me.mailSyncStatus].text }}</strong></div>
        <div class="text-sm text-gray-400">{{ mailSyncStatusMap[me.mailSyncStatus].helperText }}</div>
      </div>
      
      <UButton :to="gmailSyncUrl">
        {{ mailSyncStatusMap[me.mailSyncStatus].buttonText }}
      </UButton>
    </div>
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
    helperText: 'Please click the button below to setup Relevance',
    buttonText: 'Sync Google Account',
  },
  ready: {
    text: 'Ready and Working',
    buttonText: 'Resync Google Account',
  },
  error: {
    // TODO
  }
}
</script>

<style lang="postcss" scoped>
</style>
