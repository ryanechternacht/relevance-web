<template>
  <div>
    <TheTopNav />

    <div class="mx-[8rem] px-8 py-4 border rounded-md border-gray-200 min-h-[calc(100vh-100px)]">
      <div class="w-full flex flex-row justify-end">
        <USelectMenu v-model="statuses"
          :options
          multiple
          icon="i-heroicons-funnel"
          class="w-[12rem]">
          <template #label>
            <span v-if="statuses.length" class="truncate">{{ map(statuses, s => s.label).join(', ') }}</span>
            <span class="text-gray-500 italic" v-else>Filter</span>
          </template>
        </USelectMenu>
      </div>

      <UTable :columns 
        :rows="filteredRows"
        :empty-state="{ icon: 'i-heroicons-inbox', label: 'No new outreach.' }"
        @select="goToOutreach">
        <template #createdAt-data="{ row }">
          {{ prettyFormatDate(row.createdAt) }}
        </template>

        <template #star-data="{ row }">
          <div class="w-[16px]">
            <div class="star flex flex-row items-center">
              <UIcon v-if="row.status === 'starred'"
                name="i-heroicons-star-solid"
                variant="fill"
                class="w-[1rem] text-blue-500" />
              <UIcon v-else-if="row.status === 'replied'"
                name="i-heroicons-arrow-uturn-left"
                class="w-[1rem] text-blue-500" />
            </div>
          </div>
        </template>

        <template #row-buttons-data="{ row }">
          <div class="w-[60px] h-[29px]">
            <div class="row-buttons flex-row items-center gap-2">
              <UButton icon="i-heroicons-star"
                variant="soft"
                size="xs"
                @click.stop="star(row)" />
              <UButton icon="i-heroicons-archive-box"
                variant="soft"
                color="red"
                size="xs"
                @click.stop="ignore(row)" />
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
import lodash_pkg from 'lodash';
const { map, filter } = lodash_pkg;

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

const options = [{
  id: 'new',
  label: 'New',
}, {
  id: 'starred',
  label: 'Starred',
}, {
  id: 'ignored',
  label: 'Ignored',
}, {
  id: 'spam',
  label: 'Spam',
}, {
  id: 'replied',
  label: 'Replied',
}]
const statuses = ref([options[0], options[1]])

const filteredRows = computed(() => {

  if (statuses.value && statuses.value.length) {
    const filterStatuses = map(statuses.value, s => s.id)
    return filter(rows, r => filterStatuses.includes(r.status))
  } else {
    return rows
  }
})

async function star (outreach) {
  await outreachStore.updateOutreach({ uuid: outreach.uuid, status: "starred"})
}

async function ignore (outreach) {
  await outreachStore.updateOutreach({ uuid: outreach.uuid, status: "ignored"})
}

const columns = [{
  label: '',
  key: 'star',
}, {
  lable: '',
  key: 'relevantEmoji'
}, {
  label: 'From',
  key: 'sender',
  sortable: true,
}, {
  label: 'Snippet',
  key: 'snippet',
}, {
  label: 'Copmany Name',
  key: 'companyName',
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
  @apply flex
}

:deep() td:has(.row-buttons) {
  width: 28px;
}

:deep() td:has(.star) {
  width: 1rem;
}
</style>
