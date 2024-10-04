export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'cool',
  },
  stytch: {
    baseUrl: "https://test.stytch.com",
    publicToken: "public-token-test-149e4c38-50fd-4eb3-9b34-0c2992e73a07",
    loginRedirectUri: "https://api.swaypage.io/v0.1/login",
    signupRedirectUri: "https://api.swaypage.io/v0.1/signup",
    scopes: "https://www.googleapis.com/auth/gmail.send",
  },
  cookies: {
    domain: '.swaypage.io'
  },
  apiBaseUrl: 'https://api.swaypage.io/',
})
