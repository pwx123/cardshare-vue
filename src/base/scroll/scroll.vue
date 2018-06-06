<template>
  <div
    ref="wrapper"
    class="wrapper"
  >
    <div class="content">
      <div
        v-if="pullDownRefresh"
        v-show="RefreshTip"
        class="pullDownRefresh-tip"
      >
        <div v-show="tipShow">
          <span class="text">{{ pullDownRefreshTip.text }}</span>
          <span
            ref="tips"
            style="display:inline-block"
          >
            <i class="icon iconfont icon-jiantou-copy"/>
          </span>
        </div>
      </div>
      <div
        v-show="inRefresh"
        class="Refresh"
      >
        <span>正在刷新</span>
        <img src="./loading.gif">
      </div>
      <slot/>
    </div>
    <!-- 解决list-shortcut跟随content滚动的问题 -->
    <slot name="list-shortcut"/>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullDownRefresh: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pullDownRefreshTip: {
        text: '下拉刷新'
      },
      tipShow: false,
      RefreshTip: true,
      inRefresh: false
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, 20)
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return
      } else {
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
      }
      if (this.listenScroll || this.pullDownRefresh) {
        this.scroll.on('scroll', pos => {
          this.$emit('scroll', pos)
          if (this.pullDownRefresh) {
            if (pos.y <= 0) {
              this.tipShow = false
              this.$refs.tips.style.transform = `rotate(0deg)`
            } else {
              this.tipShow = true
              if (pos.y > 50) {
                this.$refs.tips.style.transform = `rotate(${180}deg)`
                this.pullDownRefreshTip = {
                  text: '松开刷新'
                }
              } else {
                this.$refs.tips.style.transform = `rotate(${pos.y *
                  (180 / 50)}deg)`
                this.pullDownRefreshTip = {
                  text: '下拉刷新'
                }
              }
            }
          }
        })
      }
      if (this.pullDownRefresh) {
        this.scroll.on('touchEnd', pos => {
          if (pos.y > 50) {
            this.inRefresh = true
            this.RefreshTip = false
            this.$emit('pulldown')
            setTimeout(() => {
              this.inRefresh = false
              this.RefreshTip = true
            }, 1000)
          }
        })
      }
    },
    enable() {
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  }
}
</script>

<style lang="stylus" scoped>
.pullDownRefresh-tip
  width 100%
  height 26px
  line-height 26px
  text-align center

.Refresh
  width 100%
  height 26px
  line-height 26px
  text-align center

  img
    display inline-block
    width 18px
    height 18px
    vertical-align middle
</style>
