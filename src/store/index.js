import Vue from 'vue'
import Vuex from 'vuex'

import { defaultRequest } from '@/requests'
const requests = (localStorage.getItem('serp__Token')) ? defaultRequest(JSON.parse(localStorage.getItem('serp__Token')).value) : ''

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isAuth: false,
    authToken: '',
    isCollapseNav: false,
    user: {},
    sportTypes: [],
    eventPlaces: [],
    contractorsTypes: [
      { value: 'referee', title: 'Судья' },
      { value: 'medic', title: 'Медицинская организация' },
      { value: 'mvd', title: 'Правоохранительные органы' },
      { value: 'print', title: 'Типографии' },
      { value: 'adv', title: 'Рекламные агентства' },
      { value: 'smi', title: 'СМИ' },
      { value: 'rent', title: 'Аренда спортивного сооружения' }
    ]
  },
  mutations: {
    turnAuth (state, { token, user }) {
      state.isAuth = !!token
      state.authToken = token
      state.user = user
    },
    turnCollapseNav (state) {
      state.isCollapseNav = !state.isCollapseNav
    },
    getLists (state) {
      requests.get('sport_type/')
        .then(response => {
          state.sportTypes = response.data
        })

      requests.get('event_place/')
        .then(response => {
          state.eventPlaces = response.data
        })
    }
  },
  actions: {
  },
  modules: {
  }
})
