<template>
  <transition name="slideTop">
    <div class="modal-main" v-show="mdShow">
      <div class="content">
        <div class="msg">
          {{msg}}
        </div>
        <div class="button" @click="closeMd">确认</div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: ""
    },
    mdShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeMd() {
      this.$emit("closeMd");
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.modal-main
  position fixed
  left 0
  right 0
  bottom 0
  top 0
  background rgba(238, 238, 238, 0.5)
  display flex
  align-items center
  justify-content center

  .content
    width 300px
    height 200px
    background-color #fff
    border-radius 6px
    border 1px solid $color-theme

  .msg
    text-align center
    height 80px
    font-size 18px
    margin-top 50px
    overflow hidden
    word-wrap break-word
    padding 0 20px

  .button
    width 80px
    height 40px
    font-size 20px
    color #fff
    line-height 40px
    border-radius 5px
    text-align center
    margin 0 auto
    background-color $color-theme

.slideTop-enter-active, .slideTop-leave-active
  transition all 0.3s

.slideTop-enter, .slideTop-leave-to
  transform translate3d(0, 100%, 0)
</style>
