<template>
  <transition name="slide">
    <div class="send">
      <div class="waiting">
        <img src="./waiting.gif" alt="">
        <div>正在等待接收方加入...</div>
      </div>
      <div class="reveiver-title">接收方列表</div>
      <scroll class="receiver-list">
        <div>
          <ul v-for="(value,key) in receiverList">
            <li>用户 : {{key}}
              <span class="sendbtn" @click="sendTo(key)">发送</span>
            </li>
          </ul>
        </div>
      </scroll>
      <div class="close" @click="close">取消</div>
      <modal :msg="msg" :mdShow="mdShow" @closeMd="closeMd"></modal>
    </div>
  </transition>
</template>

<script>
import scroll from "base/scroll/scroll";
import modal from "base/modal/modal";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      user: "",
      locity: "",
      msg: "",
      mdShow: false,
      position: {},
      receiverList: {}
    };
  },
  mounted() {
    if (!this.$cookie.get("userName")) {
      this.$router.push({ path: "/CardList" });
      return;
    } else {
      this.user = this.$cookie.get("userName");
      this.startSend();
    }
  },
  methods: {
    closeMd() {
      this.mdShow = false;
    },
    startSend() {
      this.$socket.open();
      this.$socket.emit("startSend", {
        user: this.user,
        city: this.locity
      });
    },
    sendTo(receiverName) {
      this.$socket.emit("sendTo", {
        senduser: this.user,
        recuser: receiverName,
        card: this.card
      });
      this.msg = "发送完成";
      this.mdShow = true;
    },
    close() {
      this.$router.push({ path: "/CardList" });
    }
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    allReceiver(value) {
      this.receiverList = value;
    },
    err(value) {
      console.log(value);
    },
    over(value) {
      console.log(value);
    }
  },
  computed: {
    ...mapGetters(["card"])
  },
  beforeRouteLeave(to, from, next) {
    this.$socket.close();
    next();
  },
  components: {
    scroll,
    modal
  }
};
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

  .reveiver-title
    text-align center
    margin 0 auto
    margin-top 10px
    width 80%
    height 40px
    line-height 40px
    font-size 18px
    border-radius 5px
    background-color $color-theme
    color #fff

  .receiver-list
    width 80%
    height 200px
    margin 0 auto
    margin-top 20px
    padding 0px 20px
    box-shadow 0 2px 4px 0 rgba(0, 0, 0, 0.2)
    overflow hidden

    li
      height 40px
      line-height 40px
      border-bottom 1px solid #999
      padding 0 15px
      color #333

      .sendbtn
        float right
        display block
        width 50px
        height 30px
        text-align center
        line-height 30px
        margin-top 5px
        font-size 14px
        background-color #35ce48
        border-radius 5px
        color #fff
        transition all 0.5s

        &:active
          opacity 0.8

  .close
    width 140px
    height 40px
    line-height 40px
    text-align center
    margin 0 auto
    margin-top 20px
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

