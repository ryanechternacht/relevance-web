<template>
  <div class="flex flex-row justify-between items-center px-[8rem] pt-12 pb-4">
    <div class="flex flex-row items-center gap-2">
      <UButton v-if="back"
        variant="ghost"
        @click="emit('back')">
        <img class="w-1.125rem] h-[1.125rem]" src="/logo-back.svg">
      </UButton>
      <div v-else class="py-[.375rem] px-[.625rem]">
        <img class="w-1.125rem] h-[1.125rem]" src="/logo.svg" />
      </div>
      <span class="uppercase text-gray-900">relevance.to/{{ user.publicLink }}</span>
    </div>
    <div class="flex flex-row items-center gap-2">
      <CopyLinkToClipboardButton :user />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  user: { type: Object, required: true },
  back: { type: Boolean, default: false },
})

const emit = defineEmits(['back'])
</script>

<style lang="postcss" scoped>
</style>
