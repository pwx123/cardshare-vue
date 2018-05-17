<template>
  <transition name="slide">
    <div class="receive">
      <div class="waiting">
        <img src="./waiting.gif" alt="">
        <div>正在等待对方发送...</div>
      </div>
      <div class="close" @click="close">取消</div>
      <div class="recmodal" v-show="recmodal">
        <div class="title">接收到来自{{senduser}}的名片</div>
        <ul v-for="(value,key) in msg" class="msg">
          <li>{{value}}:{{card[key]}}</li>
        </ul>
        <div class="btns">
          <div class="btn btnsave" @click="receive">接受</div>
          <div class="btn btncancel" @click="cancel">取消</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import axios from "axios";
import { getCardId } from "common/js/util";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      user: "",
      senduser: "",
      locity: "",
      card: {},
      recmodal: false,
      msg: { userName: "姓名", phoneNum: "电话", email: "邮箱" }
    };
  },
  mounted() {
    if (!this.$cookie.get("userName")) {
      this.$router.push({ path: "/CardList" });
      return;
    } else {
      this.startCon();
    }
  },
  methods: {
    startCon() {
      this.user = this.$cookie.get("userName");
      this.startReceive();
    },
    receive() {
      this.card.cardid = getCardId(this.$cookie.get("userName"));
      axios
        .post("/users/addCart", {
          user: this.$cookie.get("userName"),
          card: this.card
        })
        .then(res => {
          if (res.data.status == 0) {
            this.setReFresh(true); //重新加载CardList
            this.$router.push({ path: "/CardList" });
          } else {
            console.log(res.data);
          }
        });
    },
    cancel() {
      this.$router.push({ path: "/CardList" });
    },
    startReceive() {
      this.$socket.open();
      this.$socket.emit("startReceive", {
        user: this.user,
        city: this.locity
      });
    },
    close() {
      this.$router.push({ path: "/CardList" });
    },
    ...mapMutations({
      setReFresh: "SET_REFRESH_MUTATION"
    })
  },
  sockets: {
    connect() {
      console.log("socket connected");
    },
    receiveCard(value) {
      this.senduser = value.senduser;
      this.card = value.card;
      this.recmodal = true;
    },
    over(value) {
      console.log(value);
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$socket.close();
    next();
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable'

.receive
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  background-color #eee
  z-index 60

  .waiting
    width 80%
    margin 0 auto
    text-align center
    padding 15px 0
    margin-top 30%

    img
      display block
      margin 0 auto
      margin-bottom 10px

  .close
    width 140px
    height 40px
    line-height 40px
    text-align center
    margin 0 auto
    margin-top 70px
    color #fff
    background-color #ec4c5d
    border-radius 5px
    transition all 0.5s

  .recmodal
    position absolute
    top 50%
    left 50%
    width 80%
    transform translate(-50%, -50%)
    background-color #fff
    border-radius 6px
    border 1px solid $color-theme
    animation comein 0.5s

    .title
      text-align center
      margin 10px
      padding-bottom 10px
      border-bottom 1px solid #999

    .msg
      margin 0 20px

      li
        height 40px
        line-height 40px
        border-bottom 1px solid #eee
        padding 0 10px

        &:first-child
          border-top 1px solid #eee

    .btns
      display flex
      justify-content space-around
      margin 10px 0px

      .btn
        width 60px
        height 30px
        font-size 18px
        color #fff
        line-height 30px
        border-radius 5px
        text-align center
        margin 0 auto
        float left
        background-color $color-theme

      .btncancel
        background-color #ec4c5d

@keyframes comein
  from
    bottom -500px
    opacity 0.3

  to
    opacity 1

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>


