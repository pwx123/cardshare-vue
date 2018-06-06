<template>
  <div class="loading">
    <img
      src="./loading.gif"
      alt="loading"
      width="24"
      height="24"
    >
    <p class="desc">{{ title }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '正在载入...'
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.loading
  width 100%
  text-align center

  .desc
    line-height 20px
    font-size $font-size-small
    color #333
</style>
