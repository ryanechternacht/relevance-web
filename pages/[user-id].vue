<template>
  <div class="p-20">
    <UFormGroup label="From">
      <UInput v-model="sender" />
    </UFormGroup>

    <UFormGroup label="Company Type">
      <USelect v-model="companyType" :options />
    </UFormGroup>

    <UFormGroup label="Snippet">
      <UInput v-model="snippet" />
    </UFormGroup>

    <UFormGroup label="Message">
      <UInput v-model="body" />
    </UFormGroup>

    <UButton @click="submit">Submit</UButton>
  </div>
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

const submit = async () => {
  await outreachStore.createOutreach({ 
    sender, 
    companyType, 
    snippet, 
    body, 
    recipient: user.email
  })

  await navigateTo('/success')
}
</script>

<style lang="postcss" scoped>
</style>
