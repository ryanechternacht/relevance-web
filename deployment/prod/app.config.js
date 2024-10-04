export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'cool',
  },
  stytch: {
    baseUrl: "https://api.stytch.com",
    publicToken: "public-token-live-c455dc7c-e606-4b74-afc6-9d9e33f9d321",
    loginRedirectUri: "https://api.relevance.to/v0.1/login",
    signupRedirectUri: "https://api.relevance.to/v0.1/signup",
    scopes: "https://www.googleapis.com/auth/gmail.send",
  },
  cookies: {
    domain: '.relevance.to'
  },
  apiBaseUrl: 'https://api.relevance.to/',
})
