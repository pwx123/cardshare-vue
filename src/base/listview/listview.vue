<template>
  <scroll @scroll="scroll" :listen-scroll="listenScroll" :probe-type="probetype" :loading="loading" :data="data" class="listview" ref="listview">
    <ul>
      <li v-for="cardgroup in data" ref="cardGroup">
        <p class="grouptitle">{{cardgroup.title}}</p>
        <ul>
          <li v-for="(card,index) in cardgroup.items" class="card" @click="select(card,colorList[index%7])">
            <div class="avatar" :style="{backgroundColor:'#'+colorList[index%7]}">{{userNameCharAt(card)}}</div>
            <div class="more"></div>
            <p class="username">{{card.userName}}</p>
            <p class="phonenum">{{card.phoneNum}}</p>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :data-index="index" :class="{active:currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="loading">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
import scroll from "base/scroll/scroll";
import loading from "base/loading/loading";
import { getData } from "common/js/dom";

const ANCGOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
      colorList: [
        "e91e63",
        "74cb58",
        "42a5f5",
        "2979ff",
        "4caf50",
        "ffeb3b",
        "cddc39"
      ]
    };
  },

  props: {
    data: {
      type: Array,
      default: []
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.probetype = 3;
    this.listHeight = [];
  },
  mounted() {
    setTimeout(() => {
      this._calculateHeight();
    }, 20);
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    select(card, color) {
      this.$emit("select", card, color);
    },
    userNameCharAt(card) {
      return card.userName.charAt(0);
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCGOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + parseInt(delta);
      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.cardGroup[index], 0);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.cardGroup || [];
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return;
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 30);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < listHeight.length; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 - -newY;
          return;
        }
      }
      this.currentIndex = this.listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  components: {
    scroll,
    loading
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.listview
  width 100%
  height 100%
  overflow hidden

  .grouptitle
    width 100%
    height 30px
    background-color $color-theme
    line-height 30px
    color #fff
    padding-left 15px

  .card
    width 100%
    height 70px
    border-bottom 1px solid #eee
    padding-left 80px
    position relative

    .avatar
      position absolute
      background-color $color-theme
      width 40px
      height 40px
      border-radius 20px
      left 18px
      top 15px
      text-align center
      line-height 40px
      color #ffffff
      font-size 20px

    .username
      height 45px
      font-size 18px
      line-height 45px

    .phonenum
      font-size 14px
      color #333

  .list-shortcut
    position absolute
    right 0
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 0
    border-radius 10px
    background rgba(220, 220, 220, 0.8)
    text-align center

    .item
      padding 3px
      line-height 1
      color #000
      font-size $font-size-small

    .active
      color $color-theme

  .list-fixed
    position absolute
    top 0
    left 0
    width 100%

    .fixed-title
      height 30px
      line-height 30px
      padding-left 15px
      color #fff
      background $color-theme

.loading-container
  position absolute
  width 100%
  top 50%
  transform translateY(-50%)
</style>

