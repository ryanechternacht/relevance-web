<template>
  <div class="w-full flex flex-row items-center justify-between px-12 py-8">
    <slot name="action-items">
      <div></div>
    </slot>

    <div>
      <h1>Inbox</h1>
    </div>

    <div class="flex flex-row items-center gap-2">
      <div class="text-gray-500">Relevance to</div>
      <img :src="me.image" class="h-[1.5rem] w-[1.5rem] rounded-full" />
    </div>
  </div>
</template>

<script setup>
import { useUsersStore } from '@/stores/users';
import { storeToRefs } from 'pinia' 

const usersStore = useUsersStore()
const { getMeCached } = storeToRefs(usersStore)

const [me] = await Promise.all([
  getMeCached.value(),
])
</script>

<style lang="postcss" scoped>
</style>
