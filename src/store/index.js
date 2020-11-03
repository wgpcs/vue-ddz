import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import ipoker from './modules/ipoker'
import app from './modules/app'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ipoker,
    app
  },
  getters
})
