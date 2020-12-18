import { getEventFieldQuery } from '@/api/api'
const state = {
    eventField: [],
    activeName: 'first'
}

const mutations = {
   'SAVE_EVENT_FIELD'(state, payload) {
        state.eventField = payload instanceof Array ? payload : []
    },
    'SAVE_ACTIVE_NAME'(state, payload) {
        state.activeName = payload
    }
}

const getters = {
    
}

const actions = {
    async getEventFields({ state, commit }, payload = {}) {
        try {
            const res = await getEventFieldQuery(payload)
            const arr = res.map((item) => {
                return {
                    label: item.placeName,
                    value: item.efId
                }
            })
            commit('SAVE_EVENT_FIELD', arr)
        } catch (e) {}
    },
    setActiveName({ state, commit }, payload = 'first') {
        commit('SAVE_ACTIVE_NAME', payload)
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}