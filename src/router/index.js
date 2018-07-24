import Vue from 'vue'
import Router from 'vue-router'
/* eslint-disable */
const CardList = () =>
  import (/* webpackChunkName: "CardList" */"@/components/CardList/CardList")
const Account = () =>
  import (/* webpackChunkName: "Account" */"@/components/Account/Account")
const Event = () =>
  import (/* webpackChunkName: "Event" */"@/components/Event/Event")
const CardDetail = () =>
  import (/* webpackChunkName: "CardDetail" */"@/components/CardDetail/CardDetail")
const Login = () =>
  import (/* webpackChunkName: "Login" */"@/components/Login/Login")
const Reg = () =>
  import (/* webpackChunkName: "Reg" */"@/components/Reg/Reg")
const Send = () =>
  import (/* webpackChunkName: "Send" */"@/components/Send/Send")
const Receive = () =>
  import (/* webpackChunkName: "Receive" */"@/components/Receive/Receive")
const AddCard = () =>
  import (/* webpackChunkName: "AddCard" */"@/components/AddCard/AddCard")
const Search = () =>
  import (/* webpackChunkName: "Search" */"@/components/Search/Search")
const UserMsg = () =>
  import (/* webpackChunkName: "UserMsg" */"@/components/UserMsg/UserMsg")
const AddEvent = () =>
  import (/* webpackChunkName: "AddEvent" */"@/components/AddEvent/AddEvent")
/* eslint-enable */
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: '',
    redirect: '/CardList'
  }, {
    path: '/CardList',
    name: 'CardList',
    component: CardList,
    meta: {
      keepAlive: true
    }
  }, {
    path: '/CardDetail',
    name: 'CardDetail',
    component: CardDetail
  }, {
    path: '/Send',
    name: 'Send',
    component: Send
  }, {
    path: '/Account',
    name: 'Account',
    component: Account
  }, {
    path: '/Event',
    name: 'Event',
    component: Event
  }, {
    path: '/Login',
    name: 'Login',
    component: Login
  }, {
    path: '/Reg',
    name: 'Reg',
    component: Reg
  }, {
    path: '/Receive',
    name: 'Receive',
    component: Receive
  }, {
    path: '/AddCard',
    name: 'AddCard',
    component: AddCard
  }, {
    path: '/Search',
    name: 'Search',
    component: Search
  }, {
    path: '/UserMsg',
    name: 'UserMsg',
    component: UserMsg
  }, {
    path: '/AddEvent',
    name: 'AddEvent',
    component: AddEvent
  }]
})
