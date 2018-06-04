<template>
  <div class="event">
    <div class="header">
      <span>发现</span>
      <i class="icon iconfont icon-add"></i>
    </div>
    <scroll @pulldown="pulldown" :data="eventList" :pullDownRefresh="pullDownRefresh" :probe-type="probetype" :listenScroll="listenScroll" class="eventList" ref="eventList">
      <ul>
        <li v-for="(item,index) in eventList" class="eventItem">
          <div class="item">
            <a :href="'tel:'+item.phoneNum" class="phoneNum">
              <span>
                <i class="icon iconfont icon-jisuanqi"></i>
              </span>
              {{item.phoneNum}}</a>
            <div class="title">{{item.event.title}}</div>
            <div class="detail">
              <p>
                {{item.event.detail}}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </scroll>
    <tips class="tips" :msg="msg" :type="type" v-show="tipsShow"></tips>
  </div>
</template>

<script>
import scroll from "base/scroll/scroll";
import tips from "base/tips/tips";
import { mapGetters } from "vuex";

import axios from "axios";
export default {
  name: "Event",
  data() {
    return {
      listenScroll: true,
      pullDownRefresh: true,
      probetype: 3,
      eventList: [],
      msg: "",
      type: "primary",
      tipsShow: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.getEventList();
    }, 20);
  },
  activated() {
    this.loginUserEmail = this.$cookie.get("loginUserEmail");
    if (this.refresh) {
      this.getEventList();
    }
  },
  computed: {
    ...mapGetters(["refresh"])
  },
  methods: {
    getEventList() {
      axios
        .post("/users/getEventList", {
          loginUserEmail: this.$cookie.get("loginUserEmail")
        })
        .then(res => {
          if (res.data.status == 0) {
            if (res.data.result) {
              console.log(res.data.result);
              this.eventList = res.data.result;
            }
          } else {
            console.log(res.data);
          }
        });
    },
    pulldown() {
      axios
        .post("/users/getEventList", {
          loginUserEmail: this.$cookie.get("loginUserEmail")
        })
        .then(res => {
          if (res.data.status == 0) {
            if (res.data.result) {
              console.log(res.data.result);
              this.type = "primary";
              this.msg = "刷新成功";
            }
          } else {
            this.type = "danger";
            this.msg = "刷新失败";
            console.log(res.data);
          }
          setTimeout(() => {
            this.tipsShow = true;
          }, 1000);
          setTimeout(() => {
            this.tipsShow = false;
          }, 3000);
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    //解决手机键盘弹起better-sroll失效的问题
    next(vm => {
      vm.$refs.eventList.refresh();
    });
  },
  components: {
    scroll,
    tips
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.event
  width 100%

  .header
    background-color $color-theme
    width 100%
    height 44px
    line-height 44px
    padding-left 15px
    color #fff
    font-size 18px
    border-bottom 1px solid #eee
    position relative

    i
      font-size 20px
      font-weight bold
      position absolute
      right 30px
      color #eee

  .eventList
    position fixed
    top 45px
    bottom 51px
    left 0
    right 0
    overflow hidden

    .eventItem
      width 100%
      height 110px
      padding 0px 0px 20px 0px

      .item
        width 90%
        margin 0 auto
        height 100px
        box-shadow 0px 2px 4px 1px rgba(0, 0, 0, 0.2)
        padding 10px 0px

        .phoneNum
          margin-left 10px

        .title
          margin 10px 10px 5px 10px
          font-weight bold
          font-size 18px

        .detail
          margin 0 10px
          font-size 16px
          height 48px
          overflow hidden
          position relative

          p
            overflow hidden /* 超出隐藏 */
            text-overflow ellipsis /* 文本溢出时显示省略标记 */
            display -webkit-box /* 设置弹性盒模型 */
            -webkit-line-clamp 3 /* 文本占的行数,如果要设置2行加...则设置为2 */
            -webkit-box-orient vertical /* 子代元素垂直显示 */
</style>
