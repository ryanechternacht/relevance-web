import { defineStore } from 'pinia'
import lodash_pkg from 'lodash'
const { find, remove } = lodash_pkg

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useOutreachStore = defineStore('outreach', {
  state: () => ({
    outreach: {},
  }),
  getters: {
    getOutreach: (state, statuses) => async () => {
      await state.fetchOutreach({ statuses })
      return state.outreach?.content
    },
    getOutreachByUuid: (state) => async (uuid) => {
      await state.fetchOutreach()
      return find(state.outreach?.content, o => o.uuid === uuid)
    }
  },
  actions: {
    async fetchOutreach({ forceRefresh, statuses } = {}) {
      const dayjs = useDayjs()

      if (!this.email?.content
          || forceRefresh
          || is10MinutesOld(this.email?.generatedAt))
      {
        const { data } = await useApi(`/v0.1/outreach`)
        this.outreach = {
          content: data.value,
          generatedAt: dayjs().toJSON()
        }
      }
    },
    async createOutreach({ sender, body, companyType, snippet,
                           recipient, linkedinUrl, calendarUrl,
                           companyName, companyLogoUrl }) {
      const { data } = await useApi('/v0.1/outreach', {
        method: 'POST',
        body: {
          body,
          sender,
          companyType,
          snippet,
          recipient,
          calendarUrl,
          linkedinUrl,
          companyName,
          companyLogoUrl,
        }
      })
      return data.value.uuid
    },
    async updateOutreach({ uuid, status }) {
      const { data } = await useApi(`/v0.1/outreach/${uuid}`, {
        method: 'PATCH',
        body: {
          status,
        }
      })
      const o = find(this.outreach?.content, o => o.uuid === uuid)
      if (data.value.status !== undefined) {
        o.status = data.value.status
      }
    },
    async replyToOutreach({ uuid, message }) {
      const { data } = await useApi(`/v0.1/outreach/${uuid}/reply`, {
        method: 'POST',
        body: {
          message,
        }
      })
    }
  }
})
