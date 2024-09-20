export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    // TODO pull from config
    baseURL: 'http://api.buyersphere-local.com/',
    onRequest({ options }) {
      if (process.server) {
        const headers = useRequestHeaders(['cookie'])
        options.headers = { ...options.headers, ...headers }
      } else {
        options.credentials = 'include'
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo('/login'))
      }
    }
  })

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api
    }
  }
})

// The original form handled 3 difference cases... is that really necessary?

// if (Array.isArray(headers)) {
//   headers.push(['Authorization', `Bearer ${session.value?.token}`])
// } else if (headers instanceof Headers) {
//   headers.set('Authorization', `Bearer ${session.value?.token}`)
// } else {
//   headers.Authorization = `Bearer ${session.value?.token}`
// }