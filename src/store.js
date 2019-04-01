import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authUser: {},
    token: ''
  },
  mutations: {
    SET_AUTH_USER (state, payload) {
      state.authUser = payload
    },
    SET_API_TOKEN (state, payload) {
      state.token = payload
    }
  },
  actions: {
  }
})
