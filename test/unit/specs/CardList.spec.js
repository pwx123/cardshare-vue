import Vue from 'vue'
import CardList from '@/components/CardList/CardList'

describe('CardList.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(CardList)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.hello h1').textContent)
      .to.equal('Welcome to Your Vue.js App')
  })
})
