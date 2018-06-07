<template>
  <div class="account">
    <div
      class="header"
      @click="login"
    >
      <div class="name">{{ name }}</div>
      <i class="icon iconfont icon-jiantouyou" />
    </div>
    <div class="list setting first">
      <i class="icon iconfont icon-setting" />
      <span>设置</span>
    </div>
    <div
      v-show="isshow"
      class="list quit"
      @click="quit"
    >
      <i class="icon iconfont icon-tuichu" />
      <span>退出登陆</span>
    </div>
    <div class="list about">
      <i class="icon iconfont icon-about" />
      <span>关于</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    name() {
      return this.$cookie.get('loginUserEmail')
        ? this.$cookie.get('loginUserEmail')
        : '登陆/注册'
    },
    isshow() {
      return !!this.$cookie.get('loginUserEmail')
    }
  },
  methods: {
    login() {
      if (!this.isshow) {
        this.$router.push({ path: '/Login' })
      } else {
        this.$router.push({ path: '/UserMsg' })
      }
    },
    quit() {
      this.$cookie.delete('loginUserEmail')
      this.$router.push({ path: '/Login' })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.header
  width 100%
  height 100px
  position relative
  background-color $color-theme

  .name
    color #fff
    line-height 100px
    margin-left 30px
    font-size 20px
    font-weight 500

  i
    position absolute
    right 20px
    font-size 20px
    top 40px
    color #fff

.list
  height 38px
  line-height 28px
  border-bottom 1px solid #aaa
  margin 10px 20px 0px 20px
  padding 0 20px 0 20px

  span
    margin-left 10px

.first
  padding-top 10px
  border-top 1px solid #aaa
</style>
