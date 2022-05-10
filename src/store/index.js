import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    connectedUser : {},
    ludis : [],
    gladiators: []
  },
  mutations: {
    updateConnectedUser(state, user) {
      state.connectedUser = user
    },
    updateLudisOfConnectedUser(state, ludis) {
      state.ludis = ludis
    },
    addGladiator(state, gladiator) {
      state.gladiators.push(gladiator)
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [
    createPersistedState({
      paths: ["connectedUser", "ludis", "gladiator"],
    }),
  ],
})
