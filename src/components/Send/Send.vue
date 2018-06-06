<template>
  <transition name="slide">
    <div class="send">
      <div class="waiting">
        <img
          src="./waiting.gif"
          alt=""
        >
        <div>好友输入以下数字或扫描二维码完成分享</div>
      </div>
      <div class="shareid">
        {{ shareId }}
      </div>
      <div class="qpcode">
        二维码
      </div>
      <div
        class="close"
        @click="close"
      >取消</div>
      <modal
        :msg="msg"
        :md-show="mdShow"
        @closeMd="closeMd"
      />
    </div>
  </transition>
</template>

<script>
import scroll from 'base/scroll/scroll'
import modal from 'base/modal/modal'
import { mapGetters } from 'vuex'

export default {
  components: {
    scroll,
    modal
  },
  data() {
    return {
      user: '',
      locity: '',
      msg: '',
      mdShow: false,
      position: {},
      receiverList: {},
      shareId: ''
    }
  },
  computed: {
    ...mapGetters(['card'])
  },
  mounted() {
    if (!this.$cookie.get('loginUserEmail') || !this.card.userName) {
      this.$router.push({ path: '/CardList' })
    } else {
      this.user = this.$cookie.get('loginUserEmail')
      this.shareId = this.getRandNum()
      this.startSend()
    }
  },
  methods: {
    closeMd() {
      this.mdShow = false
      this.$router.push({ path: '/CardList' })
    },
    startSend() {
      this.$socket.open()
      this.$socket.emit('startSend', {
        user: this.user,
        shareId: this.shareId,
        card: this.card
      })
    },
    getRandNum() {
      let str = ''
      for (let i = 0; i < 6; i++) {
        str += parseInt(Math.random() * 10)
      }
      return str
    },
    close() {
      this.$router.push({ path: '/CardList' })
    }
  },
  sockets: {
    connect() {
      console.log('socket connected')
    },
    err(value) {
      console.log(value)
    },
    over(value) {
      console.log(value)
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$socket.close()
    next()
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.send
  position fixed
  left 0
  bottom 0
  right 0
  top 0
  background-color #eee
  z-index 59

  .waiting
    width 80%
    margin 0 auto
    border-bottom 1px solid #999
    text-align center
    padding 15px 0

    img
      display block
      margin 0 auto

  .shareid
    width 100px
    height 40px
    margin 0 auto
    border-bottom 1px solid #000
    line-height 40px
    margin-top 30px
    text-align center
    font-size 20px
    color $color-theme

  .qpcode
    width 150px
    height 150px
    margin 0 auto
    margin-top 40px
    border 1px solid #000
    text-align center
    line-height 150px

  .close
    width 140px
    height 40px
    line-height 40px
    text-align center
    margin 0 auto
    margin-top 30px
    color #fff
    background-color #ec4c5d
    border-radius 5px
    transition all 0.5s

    &:active
      opacity 0.8

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  transform translate3d(100%, 0, 0)
</style>
