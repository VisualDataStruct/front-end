import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authUser: '',
    token: '',
    getConfig: {},
    postConfig: {},
  },
  mutations: {
    SET_AUTH_USER(state, payload) {
      state.authUser = payload
    },
    SET_API_TOKEN(state, payload) {
      state.token = payload
    },
    SET_GET_CONFIG(state, payload) {
      state.getConfig = payload
    },
    SET_POST_CONFIG(state, payload) {
      state.postConfig = payload
    }
  },
  actions: {
  }
})
