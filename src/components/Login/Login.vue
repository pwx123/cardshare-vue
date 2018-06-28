<template>
  <transition name="slide">
    <div class="login">
      <h1>CardShare Login</h1>
      <input
        v-model="loginUserEmail"
        type="text"
        class="user"
        placeholder="邮箱"
      ><br>
      <input
        v-model="userPwd"
        type="password"
        class="password"
        placeholder="密码"
      ><br>
      <div v-show="identifyShow">
        <input
          v-model="identify"
          type="text"
          class="identify"
          placeholder="验证码"
        >
        <span
          class="identify-span"
          @click="getNewIdentify"
        >{{ identifyCreate }}</span>
      </div>
      <div
        class="logbtn"
        @click="login"
      >登陆</div>
      <div class="line">
        <span/>
        <b>或</b>
        <span/>
      </div>
      <router-link
        tag="div"
        class="regbtn"
        to="/Reg"
      >注册</router-link>
      <modal 
        :msg="msg"
        :md-show="mdShow"
        class="modal"
        @closeMd="closeMd"
      />
    </div>
  </transition>
</template>

<script>
import modal from 'base/modal/modal'
import axios from 'axios'
import MD5 from 'crypto-js/md5'
import { emailCheck, pwdCheck, getFiveWord } from 'common/js/util'
import { mapMutations } from 'vuex'
export default {
  components: {
    modal
  },
  data() {
    return {
      loginUserEmail: '181353@qq.com',
      userPwd: 'pwx980101',
      msg: '',
      mdShow: false,
      errCount: 0,
      identifyShow: false,
      identify: '',
      identifyCreate: '3213'
    }
  },
  methods: {
    login() {
      if (!emailCheck(this.loginUserEmail) || !pwdCheck(this.userPwd)) {
        this.msg = '邮箱或密码格式不正确'
        this.mdShow = true
        this.loginUserEmail = ''
        this.userPwd = ''
      } else {
        if (this.identifyShow) {
          if (
            this.identify.toLowerCase() !== this.identifyCreate.toLowerCase()
          ) {
            this.msg = '验证码错误'
            this.mdShow = true
            return
          }
        }
        axios
          .post('/users/login', {
            loginUserEmail: this.loginUserEmail,
            userPwd: MD5(this.userPwd).toString()
          })
          .then(res => {
            if (res.data.status === '0') {
              this.setReFresh(true)
              this.$router.push('/CardList')
            } else {
              this.errCount++
              if (this.errCount >= 3) {
                this.identifyShow = true
                this.identifyCreate = getFiveWord()
              }
              this.msg = res.data.msg
              this.mdShow = true
            }
          })
      }
    },
    getNewIdentify() {
      this.identifyCreate = getFiveWord()
    },
    closeMd() {
      this.mdShow = false
    },
    ...mapMutations({
      setReFresh: 'SET_REFRESH_MUTATION'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.login
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background-color #eee
  z-index 30
  text-align center

  h1
    margin 20% 0 30px 0
    font-size 40px

  .line
    height 20px
    margin-top 10px
    color #666
    font-size 12px

    span
      height 100%
      transform translateY(-5px)
      display inline-block
      width 35%
      border-bottom 1px solid #666
      margin 0 5px

  .user, .password
    width 60%
    height 40px
    font-size 16px
    margin-top 20px
    padding-left 20px
    border-radius 8px
    box-sizing border-box
    outline 0
    border 1px solid #bfcbd9
    transition 0.5s border-color
    appearance none

    &:focus
      border-color #20a0ff

  .identify
    width 30%
    height 40px
    font-size 16px
    margin-top 20px
    padding-left 20px
    border-radius 8px
    box-sizing border-box
    outline 0
    border 1px solid #bfcbd9
    transition 0.5s border-color
    appearance none

    &:focus
      border-color #20a0ff

  .identify-span
    display inline-block
    width 30%
    font-size 20px

  .logbtn, .regbtn
    width 140px
    height 35px
    line-height 35px
    margin 0 auto
    color #fff
    border-radius 5px
    transition all 0.2s

    &:active
      opacity 0.6

  .logbtn
    margin-top 50px
    background-color $color-theme

  .regbtn
    margin-top 20px
    background-color #999

.slide-enter-active, .slide-leave-active
  transition all 0.5s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>
