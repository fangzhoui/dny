import { talentpop, policypop, approvalNum } from '../../api/api';
const state = {
    talentapp: 0,
    policyapp: 0,
    approvalNum: 0
}

const mutations = {
    'SAVE_TALENT_APP' (state, payload) {
        state.talentapp = payload
    },
    'SAVE_POLICY_APP' (state, payload) {
        state.policyapp = payload
    },
    'SAVE_OTHER_APP' (state, payload) {
        state.approvalNum = payload
    }
}

const getters = {

}

const actions = {
    async getTalentapp ({state, commit}, payload = {}) {
        try {
            const res = await talentpop(payload)
            const num = res || 0
            commit('SAVE_TALENT_APP', num)
        } catch (e) {}
    },
    async getPolicyapp ({state, commit}, payload = {}) {
        try {
            const res = await policypop(payload)
            const num = res || 0
            commit('SAVE_POLICY_APP', num)
        } catch (e) {}
    },
    async getOtherApprovalNum ({state, commit}, payload = {}) {
        try {
            const res = await approvalNum(payload)
            const num = res || 0
            commit('SAVE_OTHER_APP', num)
        } catch (e) {}
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}