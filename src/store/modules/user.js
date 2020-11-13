const state = {
  user: null
}

const mutations = {
  TOGGLE_USER: (state, user) => {
    state.user = user
  }
}

const actions = {
  toggleUser({ commit }, user) {
    commit('TOGGLE_USER', user)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
