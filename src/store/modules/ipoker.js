// import Vue from 'vue'
const state = {
  pokers: []
}

const mutations = {
  TOGGLE_POKERS: (state, pokers) => {
    // console.log('togglePokers: ' + pokers)
    state.pokers = pokers
  }
}

const actions = {
  togglePokers({ commit }, pokers) {
    commit('TOGGLE_POKERS', pokers)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
