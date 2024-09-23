<template>
  <div>
    <TheTopNav>
      <template #action-items>
        <div>a button!</div>
      </template>
    </TheTopNav>

    <div class="max-w-[800px] mx-auto flex flex-col items-center gap-4">
      <div class="flex flex-row gap-2 items-center">
        <img v-if="outreach.companyLogoUrl"
          :src="outreach.companyLogoUrl"
          class="w-6 h-6 rounded-full" >
          <h2>{{ outreach.companyName }}</h2>
      </div>

      <h1>{{ outreach.snippet }}</h1>

      <div class="w-full flex flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-2">
          <span v-if="outreach.sender" class="text-gray-500">Made by {{ outreach.sender }}</span>
          <!-- TODO linkedin icon/url -->
          <UButton v-if="outreach.calendarUrl" 
            icon="i-heroicons-calendar"
            variant="ghost"
            :to="outreach.calendarUrl"
            class="text-blue-500" />
        </div>

        <div class="text-gray-500">
          {{ prettyFormatDate(outreach.createdAt) }}
        </div>
      </div>

      <TipTapTextarea v-model="outreach.body"
        :readonly
        class="w-full border-none p-0" />
    </div>
  </div>
</template>

<script setup>
import { useOutreachStore } from '@/stores/outreach'
import { storeToRefs } from 'pinia'

definePageMeta({
  middleware: ['enforce-gmail-login'],
})

const outreachStore = useOutreachStore()
const { getOutreachByUuid } = storeToRefs(outreachStore)

const route = useRoute()

const [outreach] = await Promise.all([
  getOutreachByUuid.value(route.params.uuid),
])

const dayjs = useDayjs()
function prettyFormatDate(date) {
  return dayjs(date).calendar()
}
</script>

<style lang="postcss" scoped>

</style>