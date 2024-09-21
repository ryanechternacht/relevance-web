<template>
  <div>
    <TheTopNav>
      <template #action-items>
        <div>a button!</div>
      </template>
    </TheTopNav>

    <div class="px-12">
      <UTable :columns :rows @select="goToOutreach">
        <template #createdAt-data="{ row }">
          {{ prettyFormatDate(row.createdAt) }}
        </template>

        <template #row-buttons-data="{ row }">
          <div class="w-[28px] h-[29px]">
            <div class="row-buttons">
              <UButton icon="i-heroicons-archive-box"
                variant="soft"
                color="red"
                size="xs"
                @click.stop="click" />
            </div>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup>
import { useOutreachStore } from '@/stores/outreach'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: ['enforce-gmail-login'],
})

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}

const outreachStore = useOutreachStore()
const { getOutreach } = storeToRefs(outreachStore)

const [rows] = await Promise.all([
  getOutreach.value(),
])

function click() {
  console.log('click')
}

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
}, {
  // row buttons
  key: 'row-buttons',
  label: '',
}]

async function goToOutreach(o) {
  return await navigateTo(`/app/${o.uuid}`)
}
</script>

<style lang="postcss" scoped>
.row-buttons {
  @apply hidden;
}

tr:hover .row-buttons {
  @apply block
}

:deep() td:has(.row-buttons) {
  width: 28px;
}
</style>
