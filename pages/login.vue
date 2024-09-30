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

const { stytch } = useAppConfig()
const googleLoginLink = computed(() => 
  `${stytch.baseUrl}/v1/public/oauth/google/start` + 
  `?public_token=${stytch.publicToken}` + 
  `&login_redirect_url=${stytch.loginRedirectUri}` +
  `&signup_redirect_url=${stytch.signupRedirectUri}`)
</script>

<style lang="postcss" scoped>
.header-bar {
  @apply w-full px-12 py-8 grid items-center;
  grid-template-columns: 1fr 1fr 1fr;
}


.google-button {
  @apply flex flex-row items-center border border-[#dadce0] 
    h-[40px] px-[12px] rounded-[4px];

  &:hover {
    @apply border-[#d2e3fc] bg-[rgba(66,133,244,.04)]
  }

  &:active {
    @apply bg-[rgba(66,133,244,.1)]
  }
}
</style>
