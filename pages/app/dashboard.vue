<template>
  <div class="p-20">
    <h1>Dashboard!</h1>

    <UTable :columns :rows @select="goToOutreach" />
  </div>
</template>

<script setup>
import { useOutreachStore } from '@/stores/outreach'
import { storeToRefs } from 'pinia'

const outreachStore = useOutreachStore()
const { getOutreach } = storeToRefs(outreachStore)

const [rows] = await Promise.all([
  getOutreach.value(),
])

const columns = [{
  label: 'From',
  key: 'sender',
  sortable: true,
}, {
  label: 'Company Type',
  key: 'companyType',
}, {
  label: 'Snippet',
  key: 'snippet',
}, {
  label: 'Received',
  key: 'createdAt',
  sortable: true,
}]

async function goToOutreach(o) {
  console.log('o', o)
  return await navigateTo(`/app/${o.uuid}`)
}
</script>

<style lang="postcss" scoped>
</style>
