<template>
  <div class="index_tab">
    <router-link to="/CardList" tag="div" class="tab">
      <i class="icon iconfont icon-barrage_fill"></i><br/> 名片夹
    </router-link>
    <router-link to="/Event" tag="div" class="tab">
      <i class="icon iconfont icon-faxian"></i><br/> 发现
    </router-link>
    <router-link to="/Account" tag="div" class="tab">
      <i class="icon iconfont icon-people_fill"></i><br/> 我的
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'

.index_tab
  width 100%
  height 50px
  position fixed
  left 0
  right 0
  bottom 0
  border-top 1px solid #ddd
  display flex
  font-size $font-size-medium
  color #333
  background-color #fff

  .tab
    flex-grow 1
    text-align center
    line-height 23px
    padding-top 2px
    cursor pointer

    &.router-link-exact-active
      color $color-theme

    i
      font-size 22px
</style>