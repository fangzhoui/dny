import { requestLogin } from "@/api/api";
const state = {
  jurisdiction: {},
};

const mutations = {
  SAVE_JURISDICTION(state, payload) {
    state.jurisdiction = payload;
  },
};

const getters = {};

const actions = {
  async getJurisdiction({ state, commit }, payload = {}) {
    try {
      const res = await requestLogin(payload);
      commit("SAVE_JURISDICTION",res.role);
    } catch (e) {
        console.log(e,741);
    }
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
