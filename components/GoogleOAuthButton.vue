<template>
  <a :href="googleLoginLink"
    class="google-button">
    <img src="/google.svg" class="mr-[18px] h-[18px] w-[18px]">
    <span class="text-[14px] text-medium" style="font-family: Roboto">
      Sign in with Google
    </span>
  </a>
</template>

<script setup>
const props = defineProps({
  forceConsent: { type: Boolean, default: false }
})

const { stytch } = useAppConfig()
const googleLoginLink = computed(() => 
  `${stytch.baseUrl}/v1/public/oauth/google/start` + 
  `?public_token=${stytch.publicToken}` + 
  `&login_redirect_url=${stytch.loginRedirectUri}` +
  `&signup_redirect_url=${stytch.signupRedirectUri}` + 
  `&custom_scopes=${stytch.scopes}` + 
  `${props.forceConsent ? '&provider_prompt=consent' : ''}`
)
</script>

<style lang="postcss" scoped>
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