<template>
  <div>
    <TheTopNav />

    <div class="mx-[8rem] px-8 py-4 border rounded-md border-gray-200 min-h-[calc(100vh-100px)]">
      <div class="w-full flex flex-row justify-end">
        <USelectMenu v-model="status"
          :options
          icon="i-heroicons-funnel"
          class="w-[12rem]">
        </USelectMenu>
      </div>

      <UTable :columns 
        :rows="filteredRows"
        :empty-state="{ icon: 'i-heroicons-inbox', label: 'No new outreach.' }"
        @select="goToOutreach">
        <!-- <template #createdAt-data="{ row }">
          {{ prettyFormatDate(row.createdAt) }}
        </template>

        <template #row-buttons-data="{ row }">
          <div class="w-[72px] h-[29px] -mx-4">
            <div class="row-buttons flex-row items-center gap-1">
              <EasyPopover text="Save">
                <UButton icon="i-heroicons-star"
                  variant="soft"
                  size="xs"
                  @click.stop="save(row)" />
              </EasyPopover>
              <EasyPopover text="Ignore">
                <UButton icon="i-heroicons-archive-box"
                  variant="soft"
                  color="red"
                  size="xs"
                  @click.stop="ignore(row)" />
              </EasyPopover>
              <EasyPopover text="Mark Spam">
                <UButton icon="i-heroicons-trash"
                  variant="soft"
                  color="red"
                  size="xs"
                  @click.stop="markSpam(row)" />
              </EasyPopover>
            </div>
          </div>
        </template> -->

        <template #createdAt-data="{ row }">
          <div class="w-[150px] h-[29px]">
            <div class="received flex flex-row items-center">
              {{ prettyFormatDate(row.createdAt) }}
            </div>
            <div class="row-buttons w-full hidden flex-row items-center gap-1">
              <EasyPopover text="Save">
                <UButton icon="i-heroicons-star"
                  variant="soft"
                  size="xs"
                  @click.stop="save(row)" />
              </EasyPopover>
              <EasyPopover text="Ignore">
                <UButton icon="i-heroicons-archive-box"
                  variant="soft"
                  color="red"
                  size="xs"
                  @click.stop="ignore(row)" />
              </EasyPopover>
              <EasyPopover text="Mark Spam">
                <UButton icon="i-heroicons-trash"
                  variant="soft"
                  color="red"
                  size="xs"
                  @click.stop="markSpam(row)" />
              </EasyPopover>
            </div>
          </div>
        </template>

        <template #snippet-data="{ row }">
          {{ row.snippet.length <= 50 ? row.snippet : row.snippet.substring(0, 50) + "..." }}
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
  id: 'saved',
  label: 'Saved',
}, {
  id: 'ignored',
  label: 'Ignored',
}, {
  id: 'replied',
  label: 'Replied',
}]

const status = ref(options[0])
const filteredRows = computed(() => {
  if (status.value.id === 'new') {
    return filter(rows, o => o.isNew)
  } else if (status.value.id === 'saved') {
    return filter(rows, o => o.isSaved)
  } else if (status.value.id === 'replied') {
    return filter(rows, o => o.hasReplied)
  } else if (status.value.id === 'ignored') {
    return filter(rows, o => o.isSpam
      || (!o.isNew && !o.isSaved && !o.hasReplied && !o.isSpam)
    )
  }
})

// TODO if you're on the save page, the save button should be an "unsave"
// same with spam
// not sure what to do on the replied page?

async function save (outreach) {
  await outreachStore.updateOutreach({ 
    uuid: outreach.uuid,
    isSaved: true,
    isNew: false,
  })
}

async function ignore (outreach) {
  await outreachStore.updateOutreach({ 
    uuid: outreach.uuid,
    isNew: false,
    isSaved: false,
  })
}

async function spam (outreach) {
  await outreachStore.updateOutreach({ 
    uuid: outreach.uuid,
    isNew: false,
    isSpam: true,
    isSaved: false,
  })
}

async function markSpam (outreach) {
  await outreachStore.updateOutreach({ 
    uuid: outreach.uuid,
    isNew: false,
    isSpam: true,
    isSaved: false,
  })
}

const columns = [{
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
  label: 'Company Name',
  key: 'companyName',
}, {
  label: 'Received',
  key: 'createdAt',
  sortable: true,
// }, {
//   // row buttons
//   key: 'row-buttons',
//   label: '',
}]

async function goToOutreach(o) {
  return await navigateTo(`/app/${o.uuid}`)
}
</script>

<style lang="postcss" scoped>
tr:hover .row-buttons {
  @apply flex
}

tr:hover .received {
  @apply hidden
}
</style>
