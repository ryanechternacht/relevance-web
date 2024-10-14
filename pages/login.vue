<template>
  <div class="header-bar">
    <div>
      <div class="text-gray-500 text-sm">Made with <span class="font-bold">Relevance</span></div>
    </div>

    <div class="w-full flex flex-row items-center justify-center gap-4">
      <img src="/logo.svg" class="h-8 w-8" />
      <h1>Relevance</h1>
    </div>

    <div><!-- intentionally blank --></div>
  </div>
  <div class="p-20 flex flex-col items-center gap-16">
    <h1>Welcome to Relevance</h1>

    <div class="w-[400px] text-center font-gray-800 italic">
      We help you screen cold outreach so you only apply to what has 
      <span class="font-semibold underline">relevance</span>
      to you
    </div>

    <GoogleOAuthButton v-if="showGoogleLogin" />
  </div>
</template>

<script setup>
const showGoogleLogin = ref(true)
</script>

<style lang="postcss" scoped>
.header-bar {
  @apply w-full px-12 py-8 grid items-center;
  grid-template-columns: 1fr 1fr 1fr;
}
</style>
