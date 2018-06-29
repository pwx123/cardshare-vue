import Reg from '@/components/Reg/Reg'
import {
  mount
} from 'vue-test-utils'

describe('两次密码不一致', () => {
  it('should render correct contents', () => {
    const wrapper = mount(Reg);
    const buttonOfReg = wrapper.find('.regbtn');
    wrapper.setData({
      loginUserEmail: '18135@qq.com'
    });
    wrapper.setData({
      userPwd: 'pwx1234'
    });
    wrapper.setData({
      userPwdRep: 'pwx12345'
    });
    buttonOfReg.trigger('click');
    const msg = wrapper.vm.msg;
    const mdShow = wrapper.vm.mdShow;
    expect(msg).to.equal('两次输入的密码不一致');
    expect(mdShow).to.equal(true);
  })
})
describe('邮箱格式不正确', () => {
  it('should render correct contents', () => {
    const wrapper = mount(Reg);
    const buttonOfReg = wrapper.find('.regbtn');
    wrapper.setData({
      loginUserEmail: '18135'
    });
    wrapper.setData({
      userPwd: 'pwx1234'
    });
    wrapper.setData({
      userPwdRep: 'pwx1234'
    });
    buttonOfReg.trigger('click');
    const msg = wrapper.vm.msg;
    const mdShow = wrapper.vm.mdShow;
    expect(msg).to.equal('邮箱或密码格式不正确 \r\n 密码为6-18位字母开头的字母和数字');
    expect(mdShow).to.equal(true);
  })
})
