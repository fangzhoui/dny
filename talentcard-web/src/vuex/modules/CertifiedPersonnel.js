const state = {
  activeName: "first",
};

const mutations = {
  changeActive(state, payload) {
    // console.log('state',state)
    // console.log('payload',payload)
    state.activeName = payload;
    //state.activeName = payload.activeName
  },
};

const getters = {};

const actions = {
  getActiveTag({ commit, state }, activeName) {
    commit("changeActive", activeName);
  },
};

export default {
  state,
  mutations,
  getters,
  actions,
};
