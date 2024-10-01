<template>
  <div class="layout">
    <slot name="action-items">
      <div></div>
    </slot>

    <div class="w-full flex flex-row items-center justify-center gap-2">
      <h1>{{ header }}</h1>
    </div>

    <div class="flex flex-row items-center gap-4 justify-end">
      <UButton to="/app/settings"
        icon="i-heroicons-cog-6-tooth"
        variant="ghost" />
      <div class="text-gray-500 -mr-2">Relevance to</div>
      <img :src="me.image" class="h-[1.5rem] w-[1.5rem] rounded-full" />
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia'

const props = defineProps({
  header: { type: String, default: "Inbox" }
})

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value(),
])
</script>

<style lang="postcss" scoped>
.layout {
  @apply px-12 py-8 w-full grid items-center;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
