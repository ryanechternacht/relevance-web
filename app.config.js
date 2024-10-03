export default defineAppConfig({
  ui: {
    primary: 'blue',
    gray: 'cool',
  },
  stytch: {
    baseUrl: "https://test.stytch.com",
    publicToken: "public-token-test-149e4c38-50fd-4eb3-9b34-0c2992e73a07",
    loginRedirectUri: "http://api.buyersphere-local.com/v0.1/login",
    signupRedirectUri: "http://api.buyersphere-local.com/v0.1/signup",
    scopes: "openid%20profile%20email%20https://www.googleapis.com/auth/gmail.send"
},
  cookies: {
    domain: '.buyersphere-local.com'
  },
  apiBaseUrl: 'http://api.buyersphere-local.com/',
})
