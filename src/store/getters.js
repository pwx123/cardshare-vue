const getters = {
  card: (state) => {
    return state.card
  },
  refresh: (state) => {
    return state.refresh
  },
  cardList: (state) => {
    return state.cardList
  },
  userMsg: (state) => {
    return state.userMsg
  },
  routeMsg: (staet) => {
    return staet.routeMsg
  }
}

export default getters
