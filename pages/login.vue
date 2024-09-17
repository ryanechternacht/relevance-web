<template>
  <div class="p-20 flex flex-col gap-32">
    <h1>Welcome to Standby</h1>

    <a
      v-if="showGoogleLogin"
      :href="googleLoginLink"
      class="google-button">
      <img src="/google.svg" class="mr-[18px] h-[18px] w-[18px]">
      <span class="text-[14px] text-medium" style="font-family: Roboto">
        Sign in with Google
      </span>
    </a>
  </div>
</template>

<script setup>

const showGoogleLogin = ref(true)
const googleLoginLink = ref("https://test.stytch.com/v1/public/oauth/google/start?public_token=public-token-test-149e4c38-50fd-4eb3-9b34-0c2992e73a07")
</script>

<style lang="postcss" scoped>
</style>
