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
    getOutreach: (state) => async () => {
      await state.fetchOutreach()
      return state.outreach?.content
    },
    getOutreachByUuid: (state) => async (uuid) => {
      await state.fetchOutreach()
      return find(state.outreach?.content, o => o.uuid === uuid)
    }
  },
  actions: {
    async fetchOutreach({ forceRefresh } = {}) {
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
                           recipient, linkedIn, calendar }) {
      const { data } = await useApi('/v0.1/outreach', {
        method: 'POST',
        body: {
          body,
          sender,
          companyType,
          snippet,
          recipient,
          calendar,
          linkedIn,
        }
      })
      return data.value.uuid
    },
    // async updateCampaign({ uuid, title, columnsApproved, aiPromptsApproved, 
    //   isPublished 
    // }) {
    //   const { apiFetch } = useNuxtApp()
    //   const { data } = await apiFetch(`/v0.1/campaign/${uuid}`, { 
    //     method: 'PATCH',
    //     body: { 
    //       title,
    //       columnsApproved,
    //       aiPromptsApproved,
    //       isPublished,
    //     }
    //   })

    //   const c = this.campaigns[uuid].content
    //   if (data.value.title !== undefined) {
    //     c.title = data.value.title
    //   }
    //   if (data.value.columnsApproved !== undefined) {
    //     c.columnsApproved = data.value.columnsApproved
    //   }
    //   if (data.value.aiPromptsApproved !== undefined) {
    //     c.aiPromptsApproved = data.value.aiPromptsApproved
    //   }
    //   if (data.value.isPublished !== undefined) {
    //     c.isPublished = data.value.isPublished
    //   }
    // },
  }
})
