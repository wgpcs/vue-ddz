const state = {
  websocket: null
}

const mutations = {
  TOGGLE_SOCKET: (state, ws) => {
    console.log('toggleSocket : ', ws)
    state.websocket = ws
  }
}

const actions = {
  toggleSocket({ commit }, ws) {
    commit('TOGGLE_SOCKET', ws)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
