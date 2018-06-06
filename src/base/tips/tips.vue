<template>
  <div
    ref="tips"
    class="tips"
  >
    <div class="content">
      <div class="msg">{{ msg }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'primary'
    }
  },
  data() {
    return {
      color: {
        primary: '#409EFF',
        danger: '#ff3333',
        warn: '#ecc843'
      }
    }
  },
  watch: {
    type(newVal) {
      let msgColor = this.color[newVal]
      if (!msgColor) {
        msgColor = '#409EFF'
      }
      this.$refs.tips.style.borderLeft = `10px solid ${msgColor}`
    }
  }
}
</script>

<style lang="stylus" scoped>
.tips
  width 100px
  height 30px
  background-color #eee
  border-left 10px solid #409EFF
  border-radius 3px
  position absolute
  left 50%
  top -60px
  margin-left -50px
  z-index 999
  animation tips 2.2s

  .msg
    height 30px
    margin-left 14px
    line-height 30px
    color #333

@keyframes tips
  0%
    top -60px

  30%
    top 48px

  50%
    top 48px

  70%
    top 48px

  100%
    top -60px
</style>
