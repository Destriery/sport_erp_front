import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuth: false,
    isCollapseNav: false
  },
  mutations: {
    turnAuth (state) {
      state.isAuth = !state.isAuth
    },
    turnCollapseNav (state) {
      state.isCollapseNav = !state.isCollapseNav
    }
  },
  actions: {
  },
  modules: {
  }
})
