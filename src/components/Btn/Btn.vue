<template>
  <div class="main">
    <div class="btns" ref="btns" @click="rotate">
      <div class="icon">
        <i class="icon iconfont icon-add"></i>
      </div>
    </div>
    <router-link tag="div" class="btn btn1" v-show="!flag" to="/Receive">
      <i class="icon iconfont icon-search"></i>
      <span>接收名片</span>
    </router-link>
    <router-link tag="div" class="btn btn2" v-show="!flag" to="/AddCard">
      <i class="icon iconfont icon-add"></i>
      <span>添加名片</span>
    </router-link>
  </div>

</template>

<script>
export default {
  data() {
    return {
      flag: true
    };
  },
  methods: {
    rotate() {
      if (this.flag) {
        this.$refs.btns.style.transform = `rotate(45deg)`;
        this.flag = !this.flag;
      } else {
        this.$refs.btns.style.transform = `rotate(0deg)`;
        this.flag = !this.flag;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.main
  position relative

  .btns
    width 44px
    height 44px
    border-radius 22px
    box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.2)
    background-color $color-theme
    transition all 0.5s

    .icon
      text-align center

      i
        font-size 30px
        line-height 44px
        color #fff
        font-weight bold

  .btn
    width 40px
    height 40px
    border-radius 20px
    position absolute
    line-height 40px
    text-align center
    color #fff
    font-weight bold

    span
      display block
      font-size 15px
      position absolute
      height 30px
      top 5px
      line-height 30px
      left -75px
      background-color #eee
      color #333
      padding 0 4px
      border-radius 3px

  .btn1
    background-color #61e6bb
    left 2px
    top -50px
    animation comein1 0.4s

  .btn2
    background-color #444eca
    left 2px
    top -98px
    animation comein2 0.6s

    i
      font-size 18px

@keyframes comein1
  from
    top 20px
    opacity 0

  to
    top -50px
    opacity 1

@keyframes comein2
  from
    top 20px
    opacity 0

  to
    top -98px
    opacity 1
</style>

