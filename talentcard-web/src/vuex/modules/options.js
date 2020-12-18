import { queryTalentCategory, queryTalentHonor, queryPolicyName, queryResponsibleUnit, getCardsFilterBase } from '../../api/api';
const state = {
    honours: [],
    categories: [],
    policy: [],
    responsible: [],
    titles: [],
    qualities: [],
    educations: [],
    cardlist: []
}

const mutations = {
    'SAVE_HONOURS'(state, payload) {
        state.honours = payload
    },
    'SAVE_CATEGORIES'(state, payload) {
        state.categories = payload
    },
    'SAVE_POLICY'(state, payload) {
        state.policy = payload
    },
    'SAVE_RESPONSIBLE'(state, payload) {
        state.responsible = payload
    },
    'SAVE_OPTIONS'(state, { titles = [], qualities = [], educations = [] }) {
        state.titles = (titles instanceof Array ? titles : Object.values(titles))
        state.qualities = (qualities instanceof Array ? qualities : Object.values(qualities))
        state.educations = (educations instanceof Array ? educations : Object.values(educations))
    },
    'SAVE_CARDLIST'(state, payload) {
        state.cardlist = payload
    },

}

const getters = {
    canUserHonours: (state) => {
        return state.honours.filter((item) => item.status == 1)
    },
    canUserCategories: (state) => {
        return state.categories.filter((item) => item.status == 1)
    },
    backfillHonours: (state) => {
        let arr = [{}]
        return arr.concat(state.honours)
    },
    canUserPolicy: (state) => {
        return state.policy.filter((item) => item.status == 1)
    },
    canUserResponsible: (state) => {
        let arr = [{ value: 1, label: '超级管理员' }]
        return arr.concat(state.responsible)
    },
    sortCategories: (state) => {
        let onArr = state.categories.filter((item) => item.status == 1)
        let oFFArr = state.categories.filter((item) => item.status == 2)
        return [...onArr, ...oFFArr]
    },
    sortHonours: (state) => {
        let onArr = state.honours.filter((item) => item.status == 1)
        let oFFArr = state.honours.filter((item) => item.status == 2)
        return [...onArr, ...oFFArr]
    }
}

const actions = {
    async getHonours({ state, commit }, payload = {}) {
        try {
            const res = await queryTalentHonor(payload)
            let arr = res.data.map((item) => {
                return {
                    value: item.honourId,
                    label: item.status == 1 ? item.name : item.name + "(已下架)",
                    status: item.status,
                    type: item.honourId,
                    text: item.status == 1 ? item.name : item.name + "(已下架)",
                }
            })
            commit('SAVE_HONOURS', arr)
        } catch (e) {
            console.log(e, 111);
        }
    },
    async getCategories({ state, commit }, payload = {}) {
        try {
            const res = await queryTalentCategory(payload)
            let arr = res.data.map(item => {
                return {
                    value: item.categoryId,
                    label: item.status == 1 ? item.name : item.name + "(已下架)",
                    status: item.status,
                    type: item.categoryId,
                    text: item.status == 1 ? item.name : item.name + "(已下架)",
                }
            })
            commit('SAVE_CATEGORIES', arr)
        } catch (e) { }
    },
    async getPolicy({ state, commit }, payload = {}) {
        try {
            const res = await queryPolicyName(payload)
            let arr = res.data.map((item) => {
                return {
                    value: item.ptid,
                    label: item.status == 1 ? item.ptname : item.ptname + "(已下架)",
                    status: item.status,
                    type: item.ptid,
                    text: item.status == 1 ? item.ptname : item.ptname + "(已下架)",
                }
            })
            commit('SAVE_POLICY', arr)
        } catch (e) {
            console.log(e, 999);
        }
    },
    async getResponsible({ state, commit }, payload = {}) {
        try {
            const res = await queryResponsibleUnit(payload)
            let arr = res.map((item) => {
                return {
                    value: item.roleId,
                    label: item.name,
                }
            })
            commit('SAVE_RESPONSIBLE', arr)
        } catch (e) {
            console.log(e, 999);
        }
    },
    getOptions({ state, commit }, payload = {}) {
        try {
            const { titles, qualities, educations } = JSON.parse(window.localStorage.getItem('config'))
            commit('SAVE_OPTIONS', { titles, qualities, educations })
        } catch (e) { }
    },
    async getCardlist({ state, commit }, payload = {}) {
        try {
            const res = await getCardsFilterBase();
            commit('SAVE_CARDLIST', [...res])
        } catch (e) {
            console.log(e);
        }
    },
}

export default {
    state,
    mutations,
    getters,
    actions
}