<template>
  <transition name="slide">
    <div class="receive">
      <div class="msg">输入数字或扫描二维码完成接受</div>
      <div class="recInput">
        <input
          v-model="shareId"
          type="text"
        >
          <span
            class="btn"
            @click="startReceive"
          >确定</span>
      </div>
      <div class="recQR">
        <span>扫一扫</span>
        <i class="icon iconfont icon-scan" />
      </div>
      <div
        class="close"
        @click="close"
      >取消</div>
    <div
      v-show="recmodal"
      class="recmodal"
    >
      <div class="title">接收到来自{{ senduser }}的名片</div>
      <ul
        v-for="(value,key) in msg"
        :key="key"
        class="msg"
      >
        <li>{{ value }}:{{ card[key] }}</li>
        </ul>
        <div class="btns">
          <div
            class="btn btnsave"
            @click="receive"
          >接受</div>
        <div
          class="btn btncancel"
          @click="cancel"
        >取消</div>
          </div>
          </div>
          <modal
            :msg="modalmsg"
            :md-show="mdShow"
            @closeMd="closeMd"
          />
          </div>
  </transition>
</template>

<script>
import axios from "axios";
import { getCardId } from "common/js/util";
import { mapMutations } from "vuex";
import modal from "base/modal/modal";

export default {
  components: {
    modal
  },
  data() {
    return {
      user: "",
      senduser: "",
      locity: "",
      card: {},
      recmodal: false,
      shareId: "",
      modalmsg: "",
      mdShow: false,
      msg: {
        userName: "姓名",
        phoneNum: "电话",
        email: "邮箱",
        address: "地址"
      }
    };
  },
  mounted() {
    if (!this.$cookie.get("loginUserEmail")) {
      this.$router.push({ path: "/CardList" });
    } else {
      this.startCon();
    }
  },
  methods: {
    startCon() {
      this.user = this.$cookie.get("loginUserEmail");
    },
    receive() {
      this.card.cardid = getCardId(this.user);
      axios
        .post("/users/addCard", {
          loginUserEmail: this.$cookie.get("loginUserEmail"),
          card: this.card
        })
        .then(res => {
          if (res.data.status === "0") {
            this.setReFresh(true); // 重新加载CardList
            this.$router.push({ path: "/CardList" });
          } else {
            console.log(res.data);
          }
        });
    },
    cancel() {
      this.recmodal = false;
    },
    startReceive() {
      if (this.shareId.trim().length === 0) {
        this.modalmsg = "请输入正确的分享码";
        this.mdShow = true;
      } else {
        this.$socket.open();
        this.$socket.emit("startReceive", {
          shareId: this.shareId
        });
      }
    },
    closeMd() {
      this.mdShow = false;
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
    },
    err(value) {
      this.modalmsg = "分享码不正确";
      this.mdShow = true;
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

  .msg
    text-align center
    margin 100px 0px 30px 0px

  .recInput
    text-align center
    width 90%
    margin 0 auto
    border-bottom 1px solid #999
    padding-bottom 20px

    input
      width 120px
      height 40px
      border-radius 6px
      box-sizing border-box
      outline 0
      border 1px solid #bfcbd9
      padding 0 15px
      transition 0.5s border-color
      appearance none

      &:focus
        border-color #20a0ff

    .btn
      display inline-block
      color #fff
      width 80px
      border-radius 5px
      height 35px
      margin-left 40px
      line-height 35px
      text-align center
      background-color $color-theme

  .recQR
    width 140px
    height 40px
    line-height 40px
    margin 0 auto
    text-align center
    border-radius 5px
    color #fff
    margin-top 40px
    font-size 20px
    background-color $color-theme

    i
      font-size 20px

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
    height 270px
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
    opacity 0.3

  to
    opacity 1

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>
