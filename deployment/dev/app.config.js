export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'cool',
  },
  stytch: {
    baseUrl: "https://test.stytch.com",
    publicToken: "public-token-test-149e4c38-50fd-4eb3-9b34-0c2992e73a07",
    // TODO update (This is default url of backend)
    loginRedirectUri: "https://api.swaypage.io/v0.1/login",
    signupRedirectUri: "https://api.swaypage.io/v0.1/signup",
  },
  cookies: {
    domain: '.swaypage.io'
  },
  apiBaseUrl: 'https://api.swaypage.io/',
})
