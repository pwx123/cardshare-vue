import Vue from 'vue'
import Router from 'vue-router'
/* eslint-disable */
const CardList = () =>
  import ("@/components/CardList/CardList")
const Account = () =>
  import ("@/components/Account/Account")
const Event = () =>
  import ("@/components/Event/Event")
const CardDetail = () =>
  import ("@/components/CardDetail/CardDetail")
const Login = () =>
  import ("@/components/Login/Login")
const Reg = () =>
  import ("@/components/Reg/Reg")
const Send = () =>
  import ("@/components/Send/Send")
const Receive = () =>
  import ("@/components/Receive/Receive")
const AddCard = () =>
  import ("@/components/AddCard/AddCard")
const Search = () =>
  import ("@/components/Search/Search")
const UserMsg = () =>
  import ("@/components/UserMsg/UserMsg")
const AddEvent = () =>
  import ("@/components/AddEvent/AddEvent")
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
