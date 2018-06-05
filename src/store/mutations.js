import Vue from 'vue'
import * as types from './mutations-types'

const mutations = {
  [types.SET_CARD_MUTATION](state, payload) {
    state.card = payload
  },
  [types.SET_REFRESH_MUTATION](state, payload) {
    state.refresh = payload
  },
  [types.SET_CARDLIST_MUTATION](state, payload) {
    state.cardList = payload
  },
  [types.SET_USERMSG_MUTATION](state, payload) {
    state.userMsg = payload
  }
}

export default mutations
