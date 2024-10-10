<template>
  <div class="layout">
    <div class="flex flex-row items-center gap-2">
      <UButton v-if="back"
        variant="ghost"
        @click="emit('back')">
        <img class="w-1.125rem] h-[1.125rem]" src="/logo-back.svg">
      </UButton>
      <div v-else class="py-[.375rem] px-[.625rem]">
        <img class="w-1.125rem] h-[1.125rem]" src="/logo.svg" />
      </div>
      <span class="uppercase">
        <span class="text-gray-500">relevance.to/</span>
        <span class="text-gray-900">{{ me.publicLink }}</span>
      </span>
    </div>

    <!-- <div class="w-full flex flex-row items-center justify-center gap-2"> -->
      <!-- TODO when we start autoblocking, track that here -->
      <!-- <div class="text-gray-400">how many have we blocked</div> -->
    <!-- </div> -->

    <div class="flex flex-row items-center gap-2 justify-end">
      <!-- TODO dropdown to do either message or link -->
      <CopyLinkToClipboardButton v-if="!isOnboarding" :user="me" />
      <CopyMessageToClipboardButton v-if="!isOnboarding" />
      <UButton v-if="!isOnboarding" 
        to="/app/settings"
        icon="i-heroicons-cog-6-tooth"
        variant="ghost" />
      <img :src="me.image" class="ml-2 h-[1.5rem] w-[1.5rem] rounded-full" />
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia'

const props = defineProps({
  header: { type: String, default: "Inbox" },
  back: { type: Boolean, default: false },
  isOnboarding: { type: Boolean, default: false },
})

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value(),
])

const { frontendBaseUrl } = useAppConfig()
const publicLink = computed(() => `${frontendBaseUrl}${me.publicLink}`)

const emit = defineEmits(['back'])
</script>

<style lang="postcss" scoped>
.layout {
  @apply px-[8rem] pt-12 pb-4 w-full grid items-center;
  grid-template-columns: 1fr 1fr;
}
</style>
