import { defineStore } from 'pinia'

// Unlike most caches, `me` dosn't use a time based refresh (because
// this data changes so infrequently). It can still be force 
// refreshed if necessary 

export const useUsersStore = defineStore('users', {
  state: () => ({ me: undefined, users: {} }),
  getters: {
    getMeCached: (state) => async () => {
      await state.fetchMe()
      return state.me
    },
    isUserLoggedIn: (state) => async () => {
      await state.fetchMe()
      return !!state.me
    },
    getUserByShortcode: (state) => async (shortcode) => {
      await state.fetchUserByShortCode({ shortcode })
      return state.users[shortcode]
    }
  },
  actions: {
    async fetchMe({ forceRefresh } = {}) {
      if (this.me === undefined || forceRefresh) {
        const { data } = await useApi('/v0.1/users/me')
        this.me = data.value
      }
    },
    async fetchUserByShortCode ({ forceRefresh, shortcode }) {
      if (!this.users[shortcode] || forceRefresh) {
        const { data } = await useApi(`/v0.1/users/shortcode/${shortcode}`)
        this.users[shortcode] = data.value
      }
    },
    async updateUser ({ relevancies, onboardingStep }) {
      const { data } = await useApi(`/v0.1/users/me`, {
        method: 'PATCH',
        body: {
          relevancies,
          onboardingStep,
        }
      })
      if (data.value.relevancies !== undefined) {
        this.me.relevancies = data.value.relevancies
      }
      if (data.value.onboardingStep !== undefined) {
        this.me.onboardingStep = data.value.onboardingStep
      }
    },
    async updatePublicLink ({ publicLink }) {
      const { data, error } = await useApi(`/v0.1/users/me/public-link`, {
        method: 'PATCH',
        body: {
          publicLink
        }
      })
      if (error.value) {
        return { error: error.value.data.error}
      } else {
        this.me.publicLink = data.value.publicLink
        return data.value
      }
    }
  },
})
