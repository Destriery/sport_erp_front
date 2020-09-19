import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    is_auth: false
  },
  mutations: {
    turn_auth (state) {
      state.is_auth = !state.is_auth
    }
  },
  actions: {
  },
  modules: {
  }
})
