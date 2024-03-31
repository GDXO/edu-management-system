import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: JSON.parse(window.localStorage.getItem('user') || 'null')
  },
  getters: {},
  mutations: {
    setUser (state, payload) {
      // 应用共享数据
      state.user = JSON.parse(payload)

      // 本地存储数据
      window.localStorage.setItem('user', payload)
    }
  },
  actions: {
    triggerSetUser ({ commit }, data) {
      commit('setUser', data)
    }
  },
  modules: {}
})
