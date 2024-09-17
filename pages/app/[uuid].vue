<template>
  <div class="p-20">
    <UFormGroup label="From">
      <UInput v-model="outreach.sender" readonly />
    </UFormGroup>

    <UFormGroup label="Company Type">
      <UInput v-model="outreach.companyType" readonly />
    </UFormGroup>

    <UFormGroup label="Snippet">
      <UInput v-model="outreach.snippet" readonly />
    </UFormGroup>

    <UFormGroup label="Body">
      <UInput v-model="outreach.body" readonly />
    </UFormGroup>

    <UFormGroup label="Sent On">
      <UInput v-model="outreach.createdAt" readonly />
    </UFormGroup>
  </div>
</template>

<script setup>
import { useOutreachStore } from '@/stores/outreach'
import { storeToRefs } from 'pinia'

const outreachStore = useOutreachStore()
const { getOutreachByUuid } = storeToRefs(outreachStore)

const route = useRoute()

const [outreach] = await Promise.all([
  getOutreachByUuid.value(route.params.uuid),
])

</script>

<style lang="postcss" scoped>

</style>