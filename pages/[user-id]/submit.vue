<template>
  <div class="header-bar">
    <div>
      <div class="text-gray-500 text-sm">Made with <span class="font-bold">Relevance</span></div>
    </div>

    <div class="w-full flex flex-row items-center justify-center gap-4">
      <img :src="user.image" class="h-[1.5rem] w-[1.5rem] rounded-full">
      <h1>Talk to {{ user.firstName }}</h1>
    </div>

    <div><!-- intentionally blank --></div>
  </div>
</template>

<script setup>
</script>

<style lang="postcss" scoped>
.header-bar {
  @apply w-full px-12 py-8 grid items-center;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
