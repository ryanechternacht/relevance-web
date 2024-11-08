import { defineStore } from 'pinia'
import lodash_pkg from 'lodash'
const { find } = lodash_pkg

function is10MinutesOld(jsonTimestamp) {
  const dayjs = useDayjs()
  return dayjs.duration(dayjs().diff(jsonTimestamp)).asMinutes() >= 10
}

export const useOutreachStore = defineStore('outreach', {
  state: () => ({
    outreach: {},
    publicOutreach: [],
  }),
  getters: {
    getOutreach: (state, statuses) => async () => {
      await state.fetchOutreach({ statuses })
      return state.outreach?.content
    },
    getOutreachByUuid: (state) => async (uuid) => {
      await state.fetchOutreach()
      return find(state.outreach?.content, o => o.uuid === uuid)
    },
    getOutreachForPublic: (state) => async (uuid) => {
      await state.fetchOutreachForPublic({ uuid })
      return find(state.publicOutreach, o => o.content.uuid === uuid)?.content
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
    async updateOutreach({ uuid, isNew, hasReplied, isSpam, isSaved }) {
      const csrfToken = useCookie('relevance-csrf-token')
      const { data } = await useApi(`/v0.1/outreach/${uuid}`, {
        method: 'PATCH',
        body: {
          isNew,
          hasReplied,
          isSpam,
          isSaved,
          csrfToken,
        }
      })
      const o = find(this.outreach?.content, o => o.uuid === uuid)
      if (data.value.isNew !== undefined) {
        o.isNew = data.value.isNew
      }
      if (data.value.hasReplied !== undefined) {
        o.hasReplied = data.value.hasReplied
      }
      if (data.value.isSpam !== undefined) {
        o.isSpam = data.value.isSpam
      }
      if (data.value.isSaved !== undefined) {
        o.isSaved = data.value.isSaved
      }
    },
    async replyToOutreach({ uuid, message }) {
      const csrfToken = useCookie('relevance-csrf-token')
      const { data } = await useApi(`/v0.1/outreach/${uuid}/reply`, {
        method: 'POST',
        body: {
          message,
          csrfToken,
        }
      })
    },
    async createOutreachByPublic ({ sender, body, snippet, recipient, linkedinUrl,
      calendarUrl, companyName, companyLogoUrl,
      relevantEmoji, relevantDescription }) {
      const csrfToken = useCookie('relevance-csrf-token')
      const dayjs = useDayjs()
      const { data, error } = await useApi('/v0.1/outreach', {
        method: 'POST',
        body: {
          body,
          sender,
          snippet,
          recipient,
          calendarUrl,
          linkedinUrl,
          companyName,
          companyLogoUrl,
          relevantEmoji,
          relevantDescription,
          csrfToken,
        }
      })
      this.publicOutreach.push({
        content: data.value,
        generatedAt: dayjs().toJSON()
      })
      return data.value.uuid
    },
    async fetchOutreachForPublic({ uuid, forceRefresh } = {}) {
      const dayjs = useDayjs()

      const outreach = find(this.publicOutreach, o => o.uuid === uuid)

      if (!outreach
          || forceRefresh
          || is10MinutesOld(outreach.generatedAt))
      {
        const { data } = await useApi(`/v0.1/outreach/${uuid}`)
        if (outreach) {
          outreach.content = data.value
          outreach.generatedAt = dayjs().toJSON()
        } else {
          this.publicOutreach.push({
            content: data.value,
            generatedAt: dayjs().toJSON()
          })
        }
      }
    },
  }
})
