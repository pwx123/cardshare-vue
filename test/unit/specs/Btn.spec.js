import Btn from '@/components/Btn/Btn'
import { mount } from 'vue-test-utils'

describe('Btn.vue', () => {
  it('should render correct contents', () => {
    const wrapper = mount(Btn);
    const button = wrapper.find('.btns');
    console.log(button.element)
    button.trigger('click');
    console.log(wrapper.find('.btn1 span').element)
    expect(wrapper.find('.btn1 span').text()).to.equal('邮箱或密码格式不正确');
  })
})
