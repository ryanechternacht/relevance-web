import { defineStore } from 'pinia'
import lodash_pkg from 'lodash';
const { findIndex } = lodash_pkg;

// Unlike most caches, `me` dosn't use a time based refresh (because
// this data changes so infrequently). It can still be force 
// refreshed if necessary 

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

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
    }
  },
})
